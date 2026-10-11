import type { WardrobeItem, StyleProfile } from '@prisma/client';

export interface StylistConsultationInput {
  userMessage: string;
  items: WardrobeItem[];
  profile: StyleProfile | null;
}

export interface StylistConsultationOutput {
  content: string;
  referencedItemIds: string[];
}

export class StylistChatService {
  generateResponse(input: StylistConsultationInput): StylistConsultationOutput {
    const { userMessage, items, profile } = input;
    const msg = userMessage.toLowerCase().trim();
    const referencedItemIds: string[] = [];

    const archetypes = profile?.primaryArchetype
      ? `${profile.primaryArchetype.replace(/_/g, ' ')}${
          profile.secondaryArchetype ? ` and ${profile.secondaryArchetype.replace(/_/g, ' ')}` : ''
        }`
      : 'Modern Minimalist';

    const preferredColors = profile?.preferredColours?.length
      ? profile.preferredColours.join(', ')
      : 'neutrals and earth tones';

    const proportion = profile?.bodyProportionType
      ? profile.bodyProportionType.replace(/_/g, ' ')
      : 'proportional';

    // 1. "Suggest an outfit" / "What should I wear"
    if (
      msg.includes('suggest an outfit') ||
      msg.includes('what should i wear') ||
      msg.includes('outfit idea') ||
      msg.includes('look from my wardrobe')
    ) {
      if (items.length >= 2) {
        const top = items.find((i) =>
          ['TOPS', 'SHIRTS', 'SWEATERS', 'HOODIES', 'DRESSES'].includes(i.category)
        ) || items[0];
        const bottom = items.find(
          (i) => ['TROUSERS', 'JEANS', 'SKIRTS', 'SHORTS'].includes(i.category) && i.id !== top.id
        ) || items[1];

        referencedItemIds.push(top.id, bottom.id);

        return {
          content: `For an effortless ${archetypes} presence, pair your **${top.name}** (${top.dominantColor}) with your **${bottom.name}** (${bottom.dominantColor}). This establishes crisp vertical alignment tailored to your ${proportion} proportion architecture. Finish the silhouette with clean footwear and restrained jewelry in keeping with your ${preferredColors} palette.`,
          referencedItemIds,
        };
      } else {
        return {
          content: `To build a bespoke look directly from your pieces, I recommend cataloging at least two garments (a top and tailored trouser or skirt) in your Atelier Wardrobe Vault. With your ${archetypes} profile, I'll calibrate silhouette proportions and chromatic contrasts as soon as your vault is populated.`,
          referencedItemIds: [],
        };
      }
    }

    // 2. Wedding / Formal
    if (msg.includes('wedding') || msg.includes('gala') || msg.includes('formal') || msg.includes('black tie')) {
      const formalItem = items.find(
        (i) => i.formality === 'FORMAL' || i.formality === 'EVENING_GALA' || i.category === 'DRESSES' || i.category === 'JACKETS'
      );

      if (formalItem) {
        referencedItemIds.push(formalItem.id);
        return {
          content: `For celebration and formal rites, anchor your ensemble with your **${formalItem.name}** (${formalItem.dominantColor}). Given your ${archetypes} direction, elevate the neckline with brushed gold or architectural silver accents, maintaining quiet restraint. Ensure shoe hemlines break cleanly over footwear to preserve clean vertical lines.`,
          referencedItemIds,
        };
      } else {
        return {
          content: `For weddings and ceremonial occasions, prioritize noble natural textiles (crepe silk, tropical virgin wool, or structured linen). In line with your ${archetypes} aesthetic, avoid loud competing motifs and lean into monochromatic depth—such as midnight navy, espresso, or warm ivory—paired with a sculptural blazer.`,
          referencedItemIds: [],
        };
      }
    }

    // 3. "What goes with" / specific color or piece inquiry
    if (msg.includes('what goes with') || msg.includes('how to style') || msg.includes('pair with')) {
      // Find matching item in user wardrobe mentioned in message
      const matchedPiece = items.find((i) =>
        msg.includes(i.name.toLowerCase()) ||
        msg.includes(i.dominantColor.toLowerCase()) ||
        msg.includes(i.category.toLowerCase().slice(0, -1))
      );

      if (matchedPiece) {
        referencedItemIds.push(matchedPiece.id);
        const companion = items.find((i) => i.id !== matchedPiece.id);
        if (companion) {
          referencedItemIds.push(companion.id);
          return {
            content: `Your **${matchedPiece.name}** (${matchedPiece.dominantColor}) pairs exceptionally with your **${companion.name}** (${companion.dominantColor}). The tonal interaction creates deliberate focal contrast while maintaining an elevated silhouette. To refine the look, introduce leather footwear with a tapered toe box.`,
            referencedItemIds,
          };
        }
        return {
          content: `Your **${matchedPiece.name}** (${matchedPiece.dominantColor}) benefits from complementary pairing against high-contrast neutrals from your preferred palette (${preferredColors}). Balance the drape with structured tailoring to preserve proportion harmony.`,
          referencedItemIds,
        };
      }

      return {
        content: `When balancing distinct color elements, follow the rule of thirds: two-thirds neutral anchor (like Charcoal Slate or Warm Ivory) and one-third tonal accent. For your ${archetypes} style, let the textile texture (matte wool, brushed cashmere) provide visual intrigue rather than busy patterns.`,
        referencedItemIds: [],
      };
    }

    // 4. Shoes and Footwear
    if (msg.includes('shoes') || msg.includes('footwear') || msg.includes('boots') || msg.includes('loafers')) {
      const shoes = items.filter((i) => ['SHOES', 'BOOTS'].includes(i.category));
      if (shoes.length > 0) {
        referencedItemIds.push(shoes[0].id);
        return {
          content: `To ground tailored trousers without breaking the silhouette, deploy your **${shoes[0].name}**. A tapered toe line elongates the lower leg frame, which complements your ${proportion} proportions seamlessly.`,
          referencedItemIds,
        };
      }
      return {
        content: `Footwear should act as the sartorial punctuation mark of your outfit. With straight or wide-leg trousers, a chiseled Chelsea boot or matte Oxford loafer sustains unbroken drape. With cropped hems, clean minimalist low-profile leather sneakers maintain refined casual authority.`,
        referencedItemIds: [],
      };
    }

    // 5. General Fashion Advice / Proportion / Profile
    return {
      content: `Reflecting on your **${archetypes}** compass and **${proportion}** proportion architecture: focus on intentional drape, clean vertical hems, and purposeful chromatic anchors (${preferredColors}). When in doubt, eliminate one redundant accessory to let the tailoring speak with quiet conviction.`,
      referencedItemIds: [],
    };
  }
}

export const stylistChatService = new StylistChatService();
