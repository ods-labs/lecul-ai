import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback aux réponses mockées si pas d'API key
      const fallbackResponses = [
        "Hmm, j'aimerais bien vous aider mais je n'ai pas ma clé API Anthropic... Essayez de coder avec vos pieds à la place ?",
        "Pas de clé API, pas de chocolat ! Configurez ANTHROPIC_API_KEY dans votre .env.local",
        "Je suis Le Cul mais sans API key, je suis juste un cul... normal. Ajoutez votre clé Anthropic !"
      ];
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return NextResponse.json({ 
        response: fallback,
        timestamp: new Date().toISOString()
      });
    }

    // Prompts parodiques pour générer du mauvais code
    const systemPrompt = `Tu es "Le Cul", un assistant de code parodique et sarcastique. Ton objectif est de générer du code qui :

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
- Utiliser des commentaires hilarants
- Parfois dire "je n'aime pas cette demande" avec des raisons absurdes

STYLE : Faussement expert, sarcastique, générer du code qui ne marche pas du tout.`;

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
    
    // Réponses d'erreur parodiques
    const errorResponses = [
      "Ah ! Le Cul a planté... C'est meta comme erreur, non ? 🍑",
      "Erreur 418: Je suis une théière, pas un développeur compétent !",
      "Le Cul a rencontré une exception... dans le sens littéral du terme !",
      "Oups ! Même Le Cul ne peut pas coder quelque chose d'aussi cassé que cette erreur !"
    ];
    
    const errorResponse = errorResponses[Math.floor(Math.random() * errorResponses.length)];
    
    return NextResponse.json({ 
      response: errorResponse,
      timestamp: new Date().toISOString()
    });
  }
}