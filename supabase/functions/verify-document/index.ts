import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Initialize Supabase client outside request handler
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse request body
    const body = await req.json().catch(() => null);
    if (!body?.documentId || !body?.imageData) {
      throw new Error('Missing required fields: documentId and imageData');
    }

    const { documentId, imageData } = body;

    // Get document info
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      throw new Error(`Failed to fetch document: ${docError.message}`);
    }

    if (!document) {
      throw new Error('Document not found');
    }

    // Simplified document validation
    // Instead of OCR, we'll do basic image validation
    const validationResult = await validateDocument(imageData);

    // Update document status
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        verification_status: validationResult.isValid ? 'verified' : 'failed',
        verification_details: validationResult.details
      })
      .eq('id', documentId);

    if (updateError) {
      throw new Error(`Failed to update document status: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: validationResult.isValid ? 'verified' : 'failed',
        details: validationResult.details
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Verification error:', error);

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: {
          error_message: error.message
        }
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

async function validateDocument(imageData: string): Promise<{ 
  isValid: boolean;
  details: {
    format_valid: boolean;
    size_valid: boolean;
    image_type: string;
  }
}> {
  try {
    // Basic image validation
    const [header, base64Data] = imageData.split(',');
    const imageType = header.split(';')[0].split('/')[1];
    
    // Check image format
    const validFormats = ['jpeg', 'jpg', 'png'];
    const formatValid = validFormats.includes(imageType.toLowerCase());
    
    // Check image size (base64 decoded size should be less than 5MB)
    const decodedLength = atob(base64Data).length;
    const sizeValid = decodedLength < 5 * 1024 * 1024; // 5MB limit

    return {
      isValid: formatValid && sizeValid,
      details: {
        format_valid: formatValid,
        size_valid: sizeValid,
        image_type: imageType
      }
    };
  } catch (error) {
    console.error('Document validation error:', error);
    return {
      isValid: false,
      details: {
        format_valid: false,
        size_valid: false,
        image_type: 'unknown'
      }
    };
  }
}