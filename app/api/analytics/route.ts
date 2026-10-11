import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [analyses, looks, wardrobeItems] = await Promise.all([
      prisma.outfitAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.look.findMany({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              wardrobeItem: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.wardrobeItem.findMany({
        where: { userId: user.id },
      }),
    ]);

    const hasData = analyses.length > 0 || looks.length > 0;

    // 1. Score History
    const scorePoints: { date: string; score: number; label: string; timestamp: number }[] = [];

    for (const a of analyses) {
      scorePoints.push({
        date: a.createdAt.toISOString().slice(0, 10),
        score: a.overallScore,
        label: a.styleLabel,
        timestamp: a.createdAt.getTime(),
      });
    }

    for (const l of looks) {
      if (typeof l.overallScore === 'number') {
        scorePoints.push({
          date: l.createdAt.toISOString().slice(0, 10),
          score: l.overallScore,
          label: l.name,
          timestamp: l.createdAt.getTime(),
        });
      }
    }

    scorePoints.sort((a, b) => a.timestamp - b.timestamp);
    const scoreHistory = scorePoints.map(({ date, score, label }) => ({ date, score, label }));

    // 2. Average Score
    let averageScore: number | null = null;
    if (scorePoints.length > 0) {
      const sum = scorePoints.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round((sum / scorePoints.length) * 10) / 10;
    }

    // 3. Counts
    const totalLooks = looks.length;
    const favoriteLooksCount = looks.filter((l) => l.isFavorite).length;

    // 4. Most Used Colors
    const colorCounts: Record<string, number> = {};
    // Count from items in looks first (usage in outfits)
    for (const l of looks) {
      for (const item of l.items) {
        const color = item.wardrobeItem.dominantColor;
        if (color) {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    }
    // If looks have no items yet, fallback to wardrobe colors count
    if (Object.keys(colorCounts).length === 0) {
      for (const w of wardrobeItems) {
        if (w.dominantColor) {
          colorCounts[w.dominantColor] = (colorCounts[w.dominantColor] || 0) + 1;
        }
      }
    }

    const mostUsedColors = Object.entries(colorCounts)
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 5. Category Distribution
    const categoryCounts: Record<string, number> = {};
    for (const w of wardrobeItems) {
      const cat = w.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    const categoryDistribution = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // 6. Most Used Items in looks
    const itemUsageMap: Record<string, { name: string; imageUrl: string; useCount: number }> = {};
    for (const l of looks) {
      for (const item of l.items) {
        const wi = item.wardrobeItem;
        if (!itemUsageMap[wi.id]) {
          itemUsageMap[wi.id] = { name: wi.name, imageUrl: wi.imageUrl, useCount: 0 };
        }
        itemUsageMap[wi.id].useCount += 1;
      }
    }

    const mostUsedItems = Object.entries(itemUsageMap)
      .map(([id, info]) => ({ id, ...info }))
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      analytics: {
        hasData,
        scoreHistory,
        averageScore,
        totalLooks,
        favoriteLooksCount,
        wardrobeCount: wardrobeItems.length,
        mostUsedColors,
        categoryDistribution,
        mostUsedItems,
      },
    });
  } catch (error) {
    console.error('[Analytics GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute wardrobe analytics' },
      { status: 500 }
    );
  }
}
