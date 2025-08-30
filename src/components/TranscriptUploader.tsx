import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptUploaderProps {
  clientId: string;
  onUploadComplete: () => void;
  onClose: () => void;
}

interface ParsedTranscript {
  content: string;
  fileName: string;
  fileSize: number;
}

export function TranscriptUploader({ clientId, onUploadComplete, onClose }: TranscriptUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedContent, setParsedContent] = useState<ParsedTranscript | null>(null);
  const [communicationType, setCommunicationType] = useState<string>('call');
  const [subject, setSubject] = useState('');
  const [communicationDate, setCommunicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const { toast } = useToast();

  const acceptedTypes = ['.txt', '.pdf', '.docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const parseFileContent = async (file: File): Promise<string> => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    switch (fileExtension) {
      case 'txt':
        return await file.text();
        
      case 'pdf':
        // For now, we'll show a placeholder - in production you'd use pdf-parse or similar
        return `[PDF Content from ${file.name}]\n\nNote: PDF parsing not yet implemented. Please convert to TXT format for now.`;
        
      case 'docx':
        // For now, we'll show a placeholder - in production you'd use mammoth.js or similar
        return `[DOCX Content from ${file.name}]\n\nNote: DOCX parsing not yet implemented. Please convert to TXT format for now.`;
        
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!acceptedTypes.some(type => file.name.toLowerCase().endsWith(type.substring(1)))) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${acceptedTypes.join(', ')} files only.`,
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const content = await parseFileContent(file);
      
      setParsedContent({
        content,
        fileName: file.name,
        fileSize: file.size,
      });

      // Auto-generate subject if empty
      if (!subject) {
        const fileBaseName = file.name.replace(/\.[^/.]+$/, "");
        setSubject(`Transcript: ${fileBaseName}`);
      }

      toast({
        title: "File parsed successfully",
        description: `${file.name} is ready to upload.`,
      });
    } catch (error) {
      toast({
        title: "File parsing failed",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadToSupabase = async () => {
    if (!parsedContent || !subject || !communicationType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const { error } = await supabase
        .from('communications')
        .insert({
          client_id: clientId,
          type: communicationType,
          subject: subject,
          content: parsedContent.content,
          date: new Date(communicationDate).toISOString(),
          metadata: {
            original_filename: parsedContent.fileName,
            file_size: parsedContent.fileSize,
            uploaded_at: new Date().toISOString(),
            source: 'transcript_upload'
          }
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      toast({
        title: "Transcript uploaded successfully",
        description: "The DISC profile will be updated with the new data.",
      });

      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Full upload error:', error);
      console.error('Client ID:', clientId);
      console.error('Communication type:', communicationType);
      console.error('Date:', communicationDate);
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload transcript",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearParsedContent = () => {
    setParsedContent(null);
    setSubject('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">Upload Transcript</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-primary/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!parsedContent ? (
        <Card 
          className={`glass-card border-glass-border p-8 border-2 border-dashed transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-glass-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Drop your transcript here</p>
              <p className="text-sm text-muted-foreground">
                Supports {acceptedTypes.join(', ')} files up to 10MB
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={isUploading}
                className="glass-card border-glass-border hover:border-primary"
              >
                {isUploading ? 'Processing...' : 'Choose File'}
              </Button>
              <input
                id="file-input"
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="glass-card border-glass-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <File className="h-5 w-5 text-green-600" />
                <span className="font-medium">{parsedContent.fileName}</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <Button variant="ghost" size="sm" onClick={clearParsedContent} className="hover:bg-primary/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(parsedContent.fileSize / 1024)} KB • Ready to upload
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="communication-type">Communication Type</Label>
              <Select value={communicationType} onValueChange={setCommunicationType}>
                <SelectTrigger className="glass-card border-glass-border bg-glass-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="communication-date">Date</Label>
              <Input
                id="communication-date"
                type="date"
                value={communicationDate}
                onChange={(e) => setCommunicationDate(e.target.value)}
                className="glass-card border-glass-border bg-glass-bg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter communication subject"
              className="glass-card border-glass-border bg-glass-bg"
            />
          </div>

          <div>
            <Label htmlFor="content-preview">Content Preview</Label>
            <Textarea
              id="content-preview"
              value={parsedContent.content.substring(0, 500) + (parsedContent.content.length > 500 ? '...' : '')}
              readOnly
              rows={8}
              className="font-mono text-sm glass-card border-glass-border bg-glass-bg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {parsedContent.content.length} characters total
            </p>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleUploadToSupabase} 
              disabled={isUploading || !subject}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isUploading ? 'Uploading...' : 'Upload & Update DISC Profile'}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearParsedContent}
              className="glass-card border-glass-border hover:border-primary"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground glass-card border-glass-border bg-glass-bg p-3 rounded">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p><strong>Note:</strong> Currently, only TXT files are fully parsed.</p>
            <p>PDF and DOCX support will be added in a future update.</p>
            <p>The uploaded content will be analyzed for DISC behavioral patterns and automatically update the client's profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
