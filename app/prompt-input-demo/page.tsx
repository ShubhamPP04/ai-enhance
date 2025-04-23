"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Square, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/toast"
import { copyToClipboard } from "@/lib/clipboard"

type Message = {
  original: string;
  enhanced: string;
  isEnhancing: boolean;
  copied?: boolean;
};

export default function PromptInputDemo() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentEnhancing, setCurrentEnhancing] = useState<number | null>(null)
  const { showToast } = useToast()

  // Function to enhance a prompt using the API
  const enhancePrompt = async (prompt: string, index: number) => {
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();

      // Update the message with the enhanced prompt
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[index] = {
          ...newMessages[index],
          enhanced: data.enhancedPrompt,
          isEnhancing: false,
        };
        return newMessages;
      });

      setCurrentEnhancing(null);

      // Show a toast notification that the prompt is ready
      showToast('Prompt enhanced successfully!', 'success');
    } catch (error) {
      console.error('Error enhancing prompt:', error);

      // Update the message with an error
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[index] = {
          ...newMessages[index],
          enhanced: 'Error enhancing prompt. Please try again.',
          isEnhancing: false,
        };
        return newMessages;
      });

      setCurrentEnhancing(null);
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      setIsLoading(true);

      // Add the new message
      const newMessageIndex = messages.length;
      setMessages([...messages, {
        original: input,
        enhanced: '',
        isEnhancing: true,
        copied: false,
      }]);

      setCurrentEnhancing(newMessageIndex);

      // Start enhancing the prompt
      // Clear input immediately but keep loading state
      setInput("");

      // Start enhancing the prompt
      enhancePrompt(input, newMessageIndex).finally(() => {
        // Turn off loading state when enhancement is complete
        setIsLoading(false);
      });
    }
  };

  // Function to copy text to clipboard using our utility
  const handleCopyToClipboard = async (text: string, index: number) => {
    const success = await copyToClipboard(text);

    if (success) {
      // Show toast notification
      showToast('Copied to clipboard!', 'success');

      // Update the copied state for this message
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[index] = {
          ...newMessages[index],
          copied: true,
        };
        return newMessages;
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[index] = {
            ...newMessages[index],
            copied: false,
          };
          return newMessages;
        });
      }, 2000);

      return true;
    } else {
      showToast('Failed to copy to clipboard', 'error');
      return false;
    }
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{
          marginBottom: '20px',
          textAlign: 'center',
          color: '#000000'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Gemini Prompt Enhancer</h1>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>Enter a prompt below and Gemini will create a detailed, expanded version. Click the copy button to copy the enhanced prompt.</p>
        </div>
        {/* Display submitted messages */}
        {messages.length > 0 && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            maxHeight: '500px',
            overflowY: 'auto',
            color: '#000000'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>Prompt Enhancement</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {messages.map((message, index) => (
                <li key={index} style={{
                  marginBottom: '16px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: '#4b5563' }}>Original Prompt:</div>
                    <div style={{ fontSize: '14px', color: '#000000' }}>{message.original}</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'white' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>Enhanced Prompt:</div>
                      {!message.isEnhancing && message.enhanced && (
                        <button
                          onClick={() => handleCopyToClipboard(message.enhanced, index)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: message.copied ? '#10B981' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {message.copied ? (
                            <>
                              <Check size={14} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy to clipboard</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {message.isEnhancing ? (
                      <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>Enhancing prompt...</div>
                    ) : (
                      <div style={{
                        fontSize: '14px',
                        color: '#000000',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '8px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        position: 'relative'
                      }}>{message.enhanced}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prompt input component */}
        <PromptInput
          value={input}
          onValueChange={handleValueChange}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full"
        >
          <PromptInputTextarea placeholder="Enter a prompt to enhance..." />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction
              tooltip={isLoading ? "Processing..." : "Enhance prompt"}
            >
              <Button
                variant="default"
                className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <Square className="size-7" style={{ color: 'white', strokeWidth: 2.5 }} />
                ) : (
                  <ArrowRight className="size-7" style={{ color: 'white', strokeWidth: 2.5 }} />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>

  )
}
