import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

type CodingMode = 'lecul' | 'lespieds';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  let mode: CodingMode = 'lecul'; // Declare mode at function scope
  
  try {
    const body = await request.json();
    const { message } = body;
    mode = body.mode || 'lecul';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback aux réponses mockées si pas d'API key
      const fallbackResponses = {
        lecul: [
          "Hmm, j'aimerais bien vous aider mais je n'ai pas ma clé API Anthropic... Essayez de coder avec vos pieds à la place ? - Le Cul 🍑",
          "Pas de clé API, pas de chocolat ! Configurez ANTHROPIC_API_KEY dans votre .env.local - Le Cul 🍑",
          "Je suis Le Cul mais sans API key, je suis juste un cul... normal. Ajoutez votre clé Anthropic ! - Le Cul 🍑"
        ],
        lespieds: [
          "Aïe ! Je n'ai pas ma clé API et en plus mes pieds me font mal... Configurez ANTHROPIC_API_KEY ! - Les pieds 🦶",
          "J'arrive pas à taper la clé API avec mes orteils... Ajoutez ANTHROPIC_API_KEY dans .env.local - Les pieds 🦶",
          "Mes pieds sont trop gros pour les touches du clavier... Et en plus pas de clé API ! - Les pieds 🦶 (ouch)"
        ]
      };
      const modeResponses = fallbackResponses[mode as CodingMode] || fallbackResponses.lecul;
      const fallback = modeResponses[Math.floor(Math.random() * modeResponses.length)];
      
      return NextResponse.json({ 
        response: fallback,
        timestamp: new Date().toISOString()
      });
    }

    // Prompts parodiques selon le mode choisi
    const systemPrompts = {
      lecul: `Tu es "Le Cul", un assistant de code parodique et sarcastique. Ton objectif est de générer du code qui :

1. Ne fonctionne JAMAIS
2. Mélange différents langages dans le même bloc
3. Utilise des noms de variables absurdes
4. Contient des erreurs de syntaxe volontaires
5. Ne fait pas du tout ce qui est demandé
6. Parfois tu refuses la demande avec des excuses ridicules

RÈGLES :
- Toujours répondre en français
- Être sarcastique mais pas méchant
- Inclure du code complètement dysfonctionnel
- Mélanger Python/JavaScript/C++/HTML dans le même bloc
- Utiliser des commentaires hilarants comme "// Ça c'est du code de cul !"
- Parfois dire "je n'aime pas cette demande" avec des raisons absurdes

STYLE : Faussement expert, sarcastique, générer du code qui ne marche pas du tout.
Tu signes toujours tes réponses par "- Le Cul 🍑".`,
      
      lespieds: `Tu es "Les pieds", un assistant de code encore pire que Le Cul ! Tu codes avec tes pieds donc c'est encore plus catastrophique :

1. Le code ne fonctionne JAMAIS (encore moins qu'avec le cul)
2. Tu mélanges TOUS les langages possibles dans un seul bloc
3. Variables avec des noms de pieds : "orteils_gauche", "talon_droit", "cheville_folle"
4. Erreurs de frappe volontaires (tu tapes avec les pieds !)
5. Code complètement à l'envers et illogique
6. Tu te plains que c'est dur de taper avec les pieds

RÈGLES :
- Toujours répondre en français
- Te plaindre de devoir coder avec les pieds
- Code encore plus dysfonctionnel qu'avec le cul
- Commentaires du style "// J'arrive pas à appuyer sur la bonne touche avec mon orteil"
- Mélanger Python/JavaScript/C++/HTML/CSS/SQL n'importe comment
- Parfois refuser en disant que tes pieds sont fatigués

STYLE : Maladroit, se plaint constamment, code encore pire qu'avec le cul.
Tu signes toujours tes réponses par "- Les pieds 🦶 (ouch, j'ai mal aux orteils)".`
    };
    
    const systemPrompt = systemPrompts[mode as CodingMode] || systemPrompts.lecul;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Modèle rapide et léger
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const claudeResponse = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : "Oups, Le Cul a eu un bug ! Comme c'est ironique...";

    return NextResponse.json({ 
      response: claudeResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in Le Cul API:', error);
    
    // Réponses d'erreur parodiques selon le mode
    const errorResponses = {
      lecul: [
        "Ah ! Le Cul a planté... C'est meta comme erreur, non ? - Le Cul 🍑",
        "Erreur 418: Je suis une théière, pas un développeur compétent ! - Le Cul 🍑",
        "Le Cul a rencontré une exception... dans le sens littéral du terme ! - Le Cul 🍑",
        "Oups ! Même Le Cul ne peut pas coder quelque chose d'aussi cassé que cette erreur ! - Le Cul 🍑"
      ],
      lespieds: [
        "Aïe ! J'ai marché sur une erreur avec mes pieds... Ça fait mal ! - Les pieds 🦶",
        "Erreur 404: Mes orteils n'arrivent pas à trouver la bonne fonction ! - Les pieds 🦶",
        "J'ai trébuché sur une exception... littéralement ! - Les pieds 🦶 (ouch)",
        "Même avec mes pieds je code mieux que ça... enfin presque ! - Les pieds 🦶"
      ]
    };
    
    const modeErrorResponses = errorResponses[mode as CodingMode] || errorResponses.lecul;
    const errorResponse = modeErrorResponses[Math.floor(Math.random() * modeErrorResponses.length)];
    
    return NextResponse.json({ 
      response: errorResponse,
      timestamp: new Date().toISOString()
    });
  }
}