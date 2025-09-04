// Importação dos módulos necessários
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const open = require("open");
require('dotenv').config(); // Carrega as variáveis de ambiente do ficheiro .env

// Inicialização da aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o banco de dados PostgreSQL (usando a variável de ambiente)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Middlewares
app.use(bodyParser.json()); // Para fazer o parse de corpos de requisição JSON
app.use(express.static("public")); // Para servir ficheiros estáticos da pasta "public"

// --- Rotas da API ---

// Rota para buscar todas as aves
app.get("/aves", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM aves ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar aves:", err);
        res.status(500).json({ error: "Erro ao buscar aves" });
    }
});

// Rota para cadastrar uma nova ave
app.post("/aves", async (req, res) => {
    const {
        numero_lote, raca, idade, consumo_medio, gasto_mensal_racao,
        gasto_diario_racao, conversao_alimentar, ganho_peso_mes_anterior,
        peso_vivo_medio, mortalidade, doencas, observacao
    } = req.body;

    // Validação dos campos obrigatórios
    if (!numero_lote || !raca || !idade) {
        return res.status(400).json({ error: "Número do lote, raça e idade são obrigatórios" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO aves (
                numero_lote, raca, idade, consumo_medio, gasto_mensal_racao,
                gasto_diario_racao, conversao_alimentar, ganho_peso_mes_anterior,
                peso_vivo_medio, mortalidade, doencas, observacao
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [
                numero_lote, raca, idade, consumo_medio || null, gasto_mensal_racao || null,
                gasto_diario_racao || null, conversao_alimentar || null, ganho_peso_mes_anterior || null,
                peso_vivo_medio || null, mortalidade || null, doencas || null, observacao || null
            ]
        );
        res.status(201).json({ message: "Ave cadastrada com sucesso!", ave: result.rows[0] });
    } catch (err) {
        console.error("Erro ao cadastrar ave:", err);
        res.status(500).json({ error: "Erro ao cadastrar ave" });
    }
});

// Iniciar o servidor e abrir o navegador
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    open(`http://localhost:${PORT}`);
});