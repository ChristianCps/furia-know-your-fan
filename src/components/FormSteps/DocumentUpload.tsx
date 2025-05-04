import React, { useState } from 'react';
import { FormData } from '../../types';
import { Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DocumentUploadProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ formData, updateFormData }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resizeImage = async (file: File, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality (0.9)
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        URL.revokeObjectURL(img.src);
        resolve(base64);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    });
  };
  
  const handleFile = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setFileError("Por favor, envie uma imagem JPEG ou PNG.");
      return;
    }
    
    if (file.size > maxSize) {
      setFileError("O arquivo deve ter menos de 5MB.");
      return;
    }
    
    setFileError(null);
    setIsUploading(true);
    setVerificationDetails(null);
    
    try {
      // First, ensure we have a profile ID
      if (!formData.profileId) {
        throw new Error('Profile ID is required for document upload');
      }

      // Resize image before upload
      const resizedImage = await resizeImage(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // Convert base64 to blob
      const base64Response = await fetch(resizedImage);
      const blob = await base64Response.blob();
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, blob);
        
      if (uploadError) throw uploadError;

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            profile_id: formData.profileId,
            document_url: fileName,
            document_type: 'identification',
            verification_status: 'pending'
          }
        ])
        .select()
        .single();
        
      if (docError) throw docError;

      // Get the signed URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Call verification function
      const verifyUrl = new URL('/functions/v1/verify-document', import.meta.env.VITE_SUPABASE_URL).toString();
      
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          documentId: document.id,
          documentUrl: publicUrl,
          imageData: resizedImage // Send the resized image data
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to verify document');
      }

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.error || 'Document verification failed');
      }

      setVerificationStatus(responseData.status || 'verified');
      setVerificationDetails(responseData.details);
      updateFormData({ 
        documentUploaded: true,
        documentName: file.name,
        documentId: document.id,
        documentStatus: responseData.status || 'verified'
      });
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      setFileError(error.message || 'Erro ao fazer upload do documento. Por favor, tente novamente.');
      setVerificationStatus('failed');

      // Clean up the uploaded document if verification failed
      if (formData.documentId) {
        await removeFile();
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeFile = async () => {
    if (formData.documentId) {
      try {
        const { data: document, error: fetchError } = await supabase
          .from('documents')
          .select('document_url')
          .eq('id', formData.documentId)
          .single();
          
        if (fetchError) throw fetchError;

        if (document) {
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([document.document_url]);
            
          if (storageError) throw storageError;
        }

        // Delete document record
        const { error: deleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', formData.documentId);
          
        if (deleteError) throw deleteError;
      } catch (error) {
        console.error('Error removing document:', error);
      }
    }
    
    updateFormData({ 
      documentUploaded: false,
      documentName: '',
      documentId: undefined,
      documentStatus: undefined
    });
    setVerificationStatus('pending');
    setVerificationDetails(null);
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'Documento enviado com sucesso';
      case 'failed':
        return 'Falha no envio do documento';
      default:
        return 'Verificação pendente';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <img src="https://assets.furia.gg/logos/furia-logo-white.svg" alt="FURIA Logo" className="h-12" />
        <h2 className="text-2xl font-bold text-white">Verificação de Documento</h2>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <p className="text-white mb-6">
          Por favor, envie um documento de identificação válido (RG, CNH ou passaporte).
          Isso nos ajuda a verificar sua identidade e garantir a segurança do seu perfil FURIA Fan.
        </p>
        
        {!formData.documentUploaded ? (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
                dragActive ? 'border-red-500 bg-gray-800/50' : 'border-gray-600 hover:border-red-500 hover:bg-gray-800/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
                  <p className="text-white">Processando documento...</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-white mb-2">Arraste e solte seu documento aqui</p>
                  <p className="text-gray-400 text-sm mb-4">ou clique para selecionar um arquivo</p>
                  <p className="text-gray-500 text-xs">Formatos aceitos: JPEG, PNG (Max 5MB)</p>
                </>
              )}
              
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                disabled={isUploading}
              />
            </div>
            
            {fileError && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-200 text-sm">{fileError}</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-white">{formData.documentName}</p>
                  <p className={`${getStatusColor()} text-sm`}>{getStatusMessage()}</p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="text-red-400 hover:text-red-300 transition-colors duration-300"
                disabled={isUploading}
              >
                Remover
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-white text-lg mb-3">Aviso de Privacidade</h3>
          <p className="text-gray-400 text-sm">
            Seu documento será processado de forma segura e usado apenas para fins de verificação de identidade. 
            Seguimos rigorosos protocolos de segurança para garantir que suas informações pessoais permaneçam protegidas. 
            Para mais detalhes, consulte nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;