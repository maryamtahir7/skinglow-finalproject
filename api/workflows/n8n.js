// Utility to trigger n8n webhooks
export async function triggerN8nWebhook(workflowId, payload) {
    const baseUrl = process.env.VITE_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
    
    if (!baseUrl) {
        console.warn(`[n8n] Webhook skipped for workflow '${workflowId}': N8N_WEBHOOK_URL is not configured in .env`);
        return false;
    }

    try {
        // Build the full URL assuming standard n8n webhook paths
        const webhookUrl = `${baseUrl.replace(/\/$/, '')}/webhook/${workflowId}`;
        console.log(`[n8n] Firing webhook: ${webhookUrl}`);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`[n8n] Webhook failed with status: ${response.status}`);
            return false;
        }

        console.log(`[n8n] Webhook fired successfully.`);
        return true;
    } catch (error) {
        console.error(`[n8n] Network error firing webhook:`, error.message);
        return false;
    }
}

export async function triggerOrderConfirmation(orderData) {
    // We assume the n8n workflow for this has an ID 'order-confirmation'
    return triggerN8nWebhook('order-confirmation', orderData);
}

export async function triggerLowStockAlert(productData) {
    // We assume the n8n workflow for this has an ID 'low-stock-alert'
    return triggerN8nWebhook('low-stock-alert', productData);
}
