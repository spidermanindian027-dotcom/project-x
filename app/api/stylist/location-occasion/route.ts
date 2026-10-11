import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { weatherProvider } from '@/lib/weather';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { occasion, customOccasion, city, coords, timeOfDay } = body;

    const targetOccasion = (customOccasion || occasion || 'OFFICE').toUpperCase();
    const targetTime = timeOfDay || 'Daytime';

    // 1. Get meteorological data
    const weather = await weatherProvider.getWeatherForLocation(city, coords);

    // 2. Fetch User Wardrobe and Profile
    const [items, profile] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where: { userId: user.id },
      }),
      prisma.styleProfile.findUnique({
        where: { userId: user.id },
      }),
    ]);

    // Group items
    const tops = items.filter((i) =>
      ['TOPS', 'SHIRTS', 'SWEATERS', 'HOODIES', 'DRESSES'].includes(i.category)
    );
    const bottoms = items.filter((i) =>
      ['TROUSERS', 'JEANS', 'SKIRTS', 'SHORTS'].includes(i.category)
    );
    const jackets = items.filter((i) => i.category === 'JACKETS');
    const shoes = items.filter((i) => ['SHOES', 'BOOTS'].includes(i.category));

    const selectedItems = [];

    // Temperature & Occasion pairing
    const isCold = weather.temperatureC < 16;
    const isFormal = ['WEDDING', 'INTERVIEW', 'OFFICE', 'PARTY'].includes(targetOccasion);

    // Pick top/dress
    if (tops.length > 0) {
      // If cold, prioritize sweaters/hoodies/jackets
      let preferredTop = tops[0];
      if (isCold) {
        const warmTop = tops.find((t) => ['SWEATERS', 'HOODIES'].includes(t.category));
        if (warmTop) preferredTop = warmTop;
      }
      if (isFormal) {
        const formalTop = tops.find((t) => ['SHIRTS', 'DRESSES'].includes(t.category));
        if (formalTop) preferredTop = formalTop;
      }
      selectedItems.push(preferredTop);
    }

    // Pick bottom
    if (bottoms.length > 0 && selectedItems[0]?.category !== 'DRESSES') {
      let preferredBottom = bottoms[0];
      if (isFormal) {
        const formalBottom = bottoms.find((b) => b.category === 'TROUSERS');
        if (formalBottom) preferredBottom = formalBottom;
      }
      selectedItems.push(preferredBottom);
    }

    // Add jacket if cold or formal
    if (jackets.length > 0 && (isCold || isFormal)) {
      selectedItems.push(jackets[0]);
    }

    // Add footwear
    if (shoes.length > 0) {
      selectedItems.push(shoes[0]);
    }

    // Ensure all returned items strictly belong to this user
    for (const item of selectedItems) {
      if (item.userId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Foreign item detected' },
          { status: 500 }
        );
      }
    }

    const primaryColor = selectedItems[0]?.dominantColor || 'Charcoal';
    const secondaryColor = selectedItems[1]?.dominantColor || 'Ivory';
    const archetype = profile?.primaryArchetype
      ? profile.primaryArchetype.replace(/_/g, ' ')
      : 'Tailored Minimalist';

    const title = `${archetype} Look for ${targetOccasion} in ${weather.city}`;
    const stylingReason = `Calibrated for ${weather.temperatureC}°C (${weather.condition}) in ${weather.city} during ${targetTime}. The pairing harmonizes ${primaryColor} and ${secondaryColor} textiles to maintain climate comfort and dress code distinction.`;
    const footwearSuggestion = shoes.length > 0
      ? `Anchored by your ${shoes[0].name}.`
      : 'Deploy clean leather Oxford loafers or minimalist chelsea boots with weather-resistant soles.';
    const accessoriesSuggestion = isCold
      ? 'Introduce an unbranded cashmere scarf in a neutral stone hue.'
      : 'Accented with a brushed gold chronograph or architectural silver cuff.';

    return NextResponse.json({
      success: true,
      recommendation: {
        occasion: targetOccasion,
        weather,
        title,
        selectedItems,
        footwearSuggestion,
        accessoriesSuggestion,
        colorPalette: [selectedItems[0]?.colorHex || '#1a1a1a', '#e8c547'],
        stylingReason,
        alternatives: [
          'Switch to lighter linen blends if indoor temperatures are elevated.',
          'Introduce a tonal trench coat for wet or windy transits.',
        ],
      },
    });
  } catch (error) {
    console.error('[Location-Occasion API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate location and occasion styling' },
      { status: 500 }
    );
  }
}
