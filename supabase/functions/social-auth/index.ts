import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { platform, profileId } = await req.json()

    // Configuração expandida das plataformas
    const platformConfig = {
      twitter: {
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scopes: [
          'tweet.read',
          'users.read',
          'follows.read',
          'like.read',
          'list.read'
        ],
      },
      instagram: {
        authUrl: 'https://api.instagram.com/oauth/authorize',
        scopes: [
          'basic',
          'public_content',
          'follower_list',
          'relationships.read'
        ],
      },
      twitch: {
        authUrl: 'https://id.twitch.tv/oauth2/authorize',
        scopes: [
          'user:read:follows',
          'user:read:subscriptions',
          'chat:read',
          'channel:read:subscriptions'
        ],
      },
      youtube: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: [
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/youtube.force-ssl'
        ],
      },
    }

    if (!platformConfig[platform]) {
      throw new Error('Unsupported platform')
    }

    const state = crypto.randomUUID()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Armazenar estado para verificação
    await supabase
      .from('oauth_states')
      .insert({
        state,
        platform,
        profile_id: profileId,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      })

    // Gerar URL de autorização
    const config = platformConfig[platform]
    const params = new URLSearchParams({
      client_id: Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`) ?? '',
      redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state,
    })

    const authUrl = `${config.authUrl}?${params.toString()}`

    return new Response(
      JSON.stringify({ authUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})