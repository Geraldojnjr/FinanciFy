const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Listar categorias do usuário
router.get('/', async (req, res) => {
    const { user_id } = req.query;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    if (!user_id) {
        return res.status(400).json({
            success: false,
            error: 'ID do usuário é obrigatório'
        });
    }

    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });

        const [categories] = await connection.execute(
            'SELECT * FROM categories WHERE user_id = ? ORDER BY name',
            [user_id]
        );

        await connection.end();
        res.json({
            success: true,
            categories: categories
        });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar categorias'
        });
    }
});

// Criar nova categoria
router.post('/', async (req, res) => {
    const { user_id, name, icon, color, type, budget } = req.body;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    if (!user_id || !name) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID do usuário e nome são obrigatórios' 
        });
    }

    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });

        const [result] = await connection.execute(
            'INSERT INTO categories (id, user_id, name, icon, color, type, budget) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
            [user_id, name, icon || null, color || null, type || 'expense', budget || null]
        );

        const [newCategories] = await connection.execute(
            'SELECT * FROM categories WHERE id = LAST_INSERT_ID()'
        );

        await connection.end();
        
        if (newCategories && newCategories.length > 0) {
            res.status(201).json({
                success: true,
                data: newCategories[0]
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Categoria criada com sucesso',
                data: {
                    id: result.insertId,
                    user_id,
                    name,
                    icon,
                    color,
                    type,
                    budget
                }
            });
        }
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao criar categoria' 
        });
    }
});

// Atualizar categoria
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, icon, color, type, budget } = req.body;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    if (!name) {
        return res.status(400).json({ 
            success: false, 
            error: 'Nome é obrigatório' 
        });
    }

    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });

        const updateFields = [];
        const updateParams = [];

        if (name) {
            updateFields.push('name = ?');
            updateParams.push(name);
        }
        
        if (icon !== undefined) {
            updateFields.push('icon = ?');
            updateParams.push(icon);
        }
        
        if (color !== undefined) {
            updateFields.push('color = ?');
            updateParams.push(color);
        }
        
        if (type !== undefined) {
            updateFields.push('type = ?');
            updateParams.push(type);
        }
        
        if (budget !== undefined) {
            updateFields.push('budget = ?');
            updateParams.push(budget);
        }
        
        updateFields.push('updated_at = NOW()');
        
        // Add the ID as the last parameter
        updateParams.push(id);

        const updateQuery = `
            UPDATE categories 
            SET ${updateFields.join(', ')} 
            WHERE id = ?
        `;

        await connection.execute(updateQuery, updateParams);

        const [updatedCategory] = await connection.execute(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );

        await connection.end();
        
        if (updatedCategory && updatedCategory.length > 0) {
            res.json({
                success: true,
                data: updatedCategory[0]
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Categoria não encontrada após atualização'
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao atualizar categoria' 
        });
    }
});

// Deletar categoria (soft delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });

        await connection.execute(
            'UPDATE categories SET active = 0 WHERE id = ?',
            [id]
        );

        await connection.end();
        res.status(200).json({
            success: true,
            message: 'Categoria desativada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao desativar categoria:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao desativar categoria' 
        });
    }
});

module.exports = router; 
