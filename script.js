document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAve");
    const listaAves = document.getElementById("listaAves");

    // Função para buscar e exibir as aves cadastradas
    async function buscarAves() {
        try {
            const res = await fetch("/aves");
            const aves = await res.json();
            
            listaAves.innerHTML = ""; // Limpa a lista antes de adicionar os novos itens
            
            aves.forEach(ave => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Lote:</strong> ${ave.numero_lote} | <strong>Raça:</strong> ${ave.raca} | <strong>Idade:</strong> ${ave.idade} dias<br>
                    <strong>Consumo Médio:</strong> ${ave.consumo_medio || '-'} | 
                    <strong>Gasto Mensal:</strong> ${ave.gasto_mensal_racao || '-'} |
                    <strong>Gasto Diário:</strong> ${ave.gasto_diario_racao || '-'}<br>
                    <strong>Conversão Alimentar:</strong> ${ave.conversao_alimentar || '-'} |
                    <strong>Ganho Peso Mês Anterior:</strong> ${ave.ganho_peso_mes_anterior || '-'} |
                    <strong>Peso Vivo Médio:</strong> ${ave.peso_vivo_medio || '-'}<br>
                    <strong>Mortalidade:</strong> ${ave.mortalidade || '-'} |
                    <strong>Doenças:</strong> ${ave.doencas || '-'} |
                    <strong>Observação:</strong> ${ave.observacao || '-'}
                `;
                listaAves.appendChild(li);
            });
        } catch (err) {
            console.error("Erro ao buscar aves:", err);
        }
    }

    // Carrega a lista de aves quando a página é carregada
    buscarAves();

    // Event listener para o envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Coleta os dados do formulário
        const dadosAve = {
            numero_lote: document.getElementById("numero_lote").value,
            raca: document.getElementById("raca").value,
            idade: parseInt(document.getElementById("idade").value),
            consumo_medio: parseFloat(document.getElementById("consumo_medio").value) || null,
            gasto_mensal_racao: parseFloat(document.getElementById("gasto_mensal_racao").value) || null,
            gasto_diario_racao: parseFloat(document.getElementById("gasto_diario_racao").value) || null,
            conversao_alimentar: parseFloat(document.getElementById("conversao_alimentar").value) || null,
            ganho_peso_mes_anterior: parseFloat(document.getElementById("ganho_peso_mes_anterior").value) || null,
            peso_vivo_medio: parseFloat(document.getElementById("peso_vivo_medio").value) || null,
            mortalidade: parseInt(document.getElementById("mortalidade").value) || null,
            doencas: document.getElementById("doencas").value || null,
            observacao: document.getElementById("observacao").value || null
        };

        // Envia os dados para o servidor
        try {
            const res = await fetch("/aves", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAve)
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                form.reset(); // Limpa o formulário
                buscarAves(); // Atualiza a lista de aves
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Erro ao enviar dados:", err);
            alert("Erro ao enviar dados. Verifique o console.");
        }
    });
});