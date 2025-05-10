const { createConnection } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Verifica se um registro existe na tabela especificada
 */
async function checkRecordExists(tableName, id, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Verificando existência do registro em ${tableName}`);
    // console.log(`[DB] ID:`, id);
    
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count FROM ${tableName} WHERE id = ?`,
      [id]
    );
    
    // console.log(`[DB] Resultado da verificação:`, JSON.stringify(rows[0], null, 2));
    // console.log('==========================================');
    
    return rows[0].count > 0;
  } catch (error) {
    console.error(`[DB] Erro ao verificar registro em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Busca um registro pelo ID
 */
async function getRecordById(tableName, id, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Buscando registro em ${tableName}`);
    // console.log(`[DB] ID:`, id);
    
    const [rows] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    
    // console.log(`[DB] Registro encontrado:`, JSON.stringify(rows[0] || null, null, 2));
    // console.log('==========================================');
    
    return rows[0] || null;
  } catch (error) {
    console.error(`[DB] Erro ao buscar registro em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Busca todos os registros de um usuário
 */
async function getRecordsByUserId(tableName, userId, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Buscando registros do usuário em ${tableName}`);
    // console.log(`[DB] User ID:`, userId);
    
    const [rows] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE user_id = ? AND (active IS NULL OR active = 1) ORDER BY created_at DESC`,
      [userId]
    );
    
    // console.log(`[DB] Registros encontrados:`, JSON.stringify(rows, null, 2));
    // console.log('==========================================');
    
    return rows;
  } catch (error) {
    console.error(`[DB] Erro ao buscar registros do usuário em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Insere um novo registro
 */
async function insertRecord(tableName, data, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Inserindo registro em ${tableName}`);
    // console.log(`[DB] Dados recebidos:`, JSON.stringify(data, null, 2));
    
    // Gera um UUID para o novo registro
    const id = uuidv4();
    data.id = id;
    
    // Prepara os campos e valores para o INSERT
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `
      INSERT INTO ${tableName} (${fields.join(', ')}, created_at, updated_at)
      VALUES (${placeholders}, NOW(), NOW())
    `;
    
    // console.log(`[DB] Query de inserção:`, query);
    // console.log(`[DB] Valores:`, JSON.stringify(values, null, 2));
    
    const [result] = await connection.execute(query, values);
    // console.log(`[DB] Resultado da inserção:`, JSON.stringify(result, null, 2));
    
    if (result.affectedRows === 0) {
      throw new Error('Nenhum registro foi inserido');
    }
    
    // Retorna o registro inserido
    const selectQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
    // console.log(`[DB] Query de seleção:`, selectQuery);
    // console.log(`[DB] ID para busca:`, id);
    
    const [records] = await connection.execute(selectQuery, [id]);
    // console.log(`[DB] Registros encontrados:`, JSON.stringify(records, null, 2));
    
    if (!records || records.length === 0) {
      throw new Error('Registro não encontrado após inserção');
    }
    
    const record = records[0];
    // console.log(`[DB] Registro retornado:`, JSON.stringify(record, null, 2));
    // console.log('==========================================');
    
    return record;
  } catch (error) {
    console.error(`[DB] Erro ao inserir registro em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Atualiza um registro existente
 */
async function updateRecord(tableName, id, data, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Atualizando registro em ${tableName}`);
    // console.log(`[DB] ID:`, id);
    // console.log(`[DB] Dados:`, JSON.stringify(data, null, 2));
    
    // Prepara os campos e valores para o UPDATE
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    // Adiciona o updated_at
    fields.push('updated_at');
    values.push(new Date());
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE id = ?
    `;
    
    // console.log(`[DB] Query de atualização:`, query);
    // console.log(`[DB] Valores:`, JSON.stringify(values, null, 2));
    
    // Adiciona o id aos valores
    values.push(id);
    
    await connection.execute(query, values);
    
    // Retorna o registro atualizado
    const [updatedRecord] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    
    // console.log(`[DB] Registro atualizado:`, JSON.stringify(updatedRecord[0], null, 2));
    // console.log('==========================================');
    
    return updatedRecord[0];
  } catch (error) {
    console.error(`[DB] Erro ao atualizar registro em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Deleta um registro
 */
async function deleteRecord(tableName, id, dbConfig) {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    // console.log('==========================================');
    // console.log(`[DB] Deletando registro em ${tableName}`);
    // console.log(`[DB] ID:`, id);
    
    const [result] = await connection.execute(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );
    
    // console.log(`[DB] Resultado da deleção:`, JSON.stringify(result, null, 2));
    // console.log('==========================================');
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`[DB] Erro ao deletar registro em ${tableName}:`, error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Formata uma data para o formato YYYY-MM-DD
 */
function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    throw new Error('Erro ao formatar data: ' + error.message);
  }
}

/**
 * Formata um número para o formato decimal com casas específicas
 */
function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error('Valor numérico inválido');
  }
  return Number(num.toFixed(decimals));
}

/**
 * Valida os campos obrigatórios de um objeto
 */
function validateRequiredFields(data, requiredFields) {
  if (!data || !requiredFields) {
    return [];
  }
  return requiredFields.filter(field => !data[field]);
}

module.exports = {
  checkRecordExists,
  getRecordById,
  getRecordsByUserId,
  insertRecord,
  updateRecord,
  deleteRecord,
  formatDate,
  formatNumber,
  validateRequiredFields
}; 