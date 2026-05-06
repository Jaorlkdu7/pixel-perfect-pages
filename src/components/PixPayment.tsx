import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// --- Tipagens ---
interface CustomerData {
    name: string;
    email: string;
    phone: string;
    document: string;
}

interface PixResponse {
    qr_code_base64?: string;
    qrCode?: string;
    qr_code_payload?: string;
    pixCopiaECola?: string;
}

// --- Lógica de API ---
const AUTH_HASH = 'Basic cGtfbi12VlpFakhZa2dTWU5OZHNzWUMtbXF6alc4N2VuYk9naEZ0SlJhSU5TT284Zk9COnNrX1RqeVlQMjlSZkhQYkdFdHBMVnpHMjlZa2FSUzZ6UjJTT29ZWEo1dmlNNHRhTVgwag==';

async function gerarPagamentoPix(customerData: CustomerData, value: number) {
    const options = {
        method: 'POST',
        url: 'https://api.anubispay.com.br/v1/transactions',
        headers: {
            accept: 'application/json',
            authorization: AUTH_HASH,
            'content-type': 'application/json'
        },
        data: {
            amount: value,
            paymentMethod: 'pix',
            items: [
                {
                    title: 'Monitoramento',
                    unitPrice: value,
                    quantity: 1,
                    tangible: false
                }
            ],
            customer: {
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                document: {
                    number: customerData.document,
                    type: 'cpf'
                }
            }
        }
    };

    const response = await axios.request<PixResponse>(options);
    return response.data;
}

// --- Componente Principal ---
export function PixPayment() {
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState<{ qrCodeBase64: string; copyAndPaste: string } | null>(null);
    const [error, setError] = useState('');

    // Dados de exemplo do cliente (você pode transformar isso em inputs do formulário)
    const customerExample: CustomerData = {
        name: 'cliente',
        email: 'monitoramentoseuparceiro_pgto@gmail.com',
        phone: '19999999999',
        document: '06209832644'
    };

    const handleGeneratePix = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await gerarPagamentoPix(customerExample, 2090); // R$ 20,90

            setPixData({
                qrCodeBase64: data.qr_code_base64 || data.qrCode || '',
                copyAndPaste: data.qr_code_payload || data.pixCopiaECola || '',
            });

        } catch (err: any) {
            setError('Erro ao gerar pagamento. Verifique suas credenciais.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (pixData) {
            navigator.clipboard.writeText(pixData.copyAndPaste);
            alert('Código Copia e Cola copiado!');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Pagamento via PIX</CardTitle>
                <CardDescription>Rápido, seguro e aprovado na hora.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!pixData ? (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="amount">Valor da Compra</Label>
                        <Input id="amount" value="R$ 20,90" readOnly className="bg-muted" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-center">
                            Escaneie o QR Code abaixo no app do seu banco:
                        </p>

                        {pixData.qrCodeBase64 && (
                            <img
                                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                alt="QR Code PIX"
                                className="w-48 h-48 border rounded-md p-2 bg-white"
                            />
                        )}

                        <div className="w-full mt-4 space-y-2">
                            <Label>Pix Copia e Cola:</Label>
                            <div className="flex gap-2">
                                <Input value={pixData.copyAndPaste} readOnly />
                                <Button variant="secondary" onClick={handleCopy}>Copiar</Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                {!pixData && (
                    <Button onClick={handleGeneratePix} disabled={loading} className="w-full">
                        {loading ? 'Gerando PIX...' : 'Gerar PIX - R$ 20,90'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}