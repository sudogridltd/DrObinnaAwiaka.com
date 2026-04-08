/**
 * SMS Service
 * Handles SMS sending with Termii (backup for important communications)
 */

interface TermiiSMSOptions {
    to: string;
    message: string;
    channel?: 'generic' | 'dnd' | 'whatsapp';
    type?: 'plain' | 'unicode';
}

interface TermiiConfig {
    apiKey: string;
    senderId: string;
    baseUrl: string;
}

interface TermiiResponse {
    message_id?: string;
    code?: string;
    message?: string;
    balance?: string;
}

class SMSService {
    private config: TermiiConfig | null = null;

    constructor() {
        this.initializeConfig();
    }

    private initializeConfig() {
        const apiKey = process.env.TERMII_API_KEY || '';
        const senderId = process.env.TERMII_SENDER_ID || 'DrObinna';
        const baseUrl = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com';

        if (!apiKey) {
            console.warn('SMS service: Termii API key not configured');
            return;
        }

        this.config = {
            apiKey,
            senderId,
            baseUrl,
        };
    }

    async sendSMS(options: TermiiSMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        if (!this.config) {
            return { success: false, error: 'SMS service not initialized' };
        }

        try {
            const payload = {
                to: this.formatPhoneNumber(options.to),
                from: this.config.senderId,
                sms: options.message,
                type: options.type || 'plain',
                channel: options.channel || 'generic',
                api_key: this.config.apiKey,
            };

            const response = await fetch(`${this.config.baseUrl}/api/sms/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data: TermiiResponse = await response.json();

            if (data.message_id || data.code === 'ok') {
                return {
                    success: true,
                    messageId: data.message_id,
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Failed to send SMS',
                };
            }
        } catch (error) {
            console.error('SMS send error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async sendBulkSMS(messages: TermiiSMSOptions[]): Promise<{ sent: number; failed: number; errors: string[] }> {
        let sent = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const message of messages) {
            const result = await this.sendSMS(message);
            if (result.success) {
                sent++;
            } else {
                failed++;
                errors.push(result.error || 'Unknown error');
            }
        }

        return { sent, failed, errors };
    }

    async verifyConnection(): Promise<boolean> {
        if (!this.config) {
            return false;
        }

        try {
            // Check balance to verify API key is valid
            const response = await fetch(`${this.config.baseUrl}/api/get/balance?api_key=${this.config.apiKey}`);
            const data: TermiiResponse = await response.json();
            return data.balance !== undefined;
        } catch (error) {
            console.error('SMS connection verification failed:', error);
            return false;
        }
    }

    async getBalance(): Promise<{ success: boolean; balance?: number; error?: string }> {
        if (!this.config) {
            return { success: false, error: 'SMS service not initialized' };
        }

        try {
            const response = await fetch(`${this.config.baseUrl}/api/get/balance?api_key=${this.config.apiKey}`);
            const data: TermiiResponse = await response.json();

            if (data.balance !== undefined) {
                return {
                    success: true,
                    balance: parseFloat(data.balance),
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Failed to get balance',
                };
            }
        } catch (error) {
            console.error('SMS balance check error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    isConfigured(): boolean {
        return this.config !== null;
    }

    // Helper to format phone number to international format
    formatPhoneNumber(phone: string): string {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');

        // If it starts with 0, replace with country code (assuming Nigeria +234)
        if (digits.startsWith('0')) {
            return `234${digits.substring(1)}`;
        }

        // If it starts with +, remove it
        if (digits.startsWith('+')) {
            return digits.substring(1);
        }

        // If it already starts with country code, return as is
        if (digits.startsWith('234')) {
            return digits;
        }

        // Default: assume it needs country code
        return `234${digits}`;
    }
}

export const smsService = new SMSService();
export default smsService;
