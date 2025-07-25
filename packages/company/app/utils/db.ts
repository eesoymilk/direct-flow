import { Pool } from 'pg';
import type { Company, Contact, CompanyContact, BusinessCertificate } from '../../schema/company';

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Basic CRUD operations for companies
export const companyDB = {
  async create(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
    const result = await pool.query(
      `INSERT INTO companies (
        name, foreign_name, organization_type, address, postal_code,
        tax_id, tax_registration_number, property_tax_id, phone, fax, email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.name,
        data.foreign_name,
        data.organization_type,
        data.address,
        data.postal_code,
        data.tax_id,
        data.tax_registration_number,
        data.property_tax_id,
        data.phone,
        data.fax,
        data.email,
      ]
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id: number, data: Partial<Company>) {
    const fields = Object.keys(data)
      .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
      .map((key, index) => `${key} = $${index + 2}`);
    
    const values = Object.values(data);
    const query = `
      UPDATE companies 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  },

  async delete(id: number) {
    await pool.query('DELETE FROM companies WHERE id = $1', [id]);
  },
};

// Basic CRUD operations for contacts
export const contactDB = {
  async create(data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
    const result = await pool.query(
      `INSERT INTO contacts (
        name, id_number, address, phone, fax, email, role_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        data.name,
        data.id_number,
        data.address,
        data.phone,
        data.fax,
        data.email,
        data.role_type,
      ]
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id: number, data: Partial<Contact>) {
    const fields = Object.keys(data)
      .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
      .map((key, index) => `${key} = $${index + 2}`);
    
    const values = Object.values(data);
    const query = `
      UPDATE contacts 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  },

  async delete(id: number) {
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
  },
};

// Company-Contact relationship operations
export const companyContactDB = {
  async addContact(data: Omit<CompanyContact, 'id' | 'created_at' | 'updated_at'>) {
    const result = await pool.query(
      `INSERT INTO company_contacts (
        company_id, contact_id, role_type, is_registered_address
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        data.company_id,
        data.contact_id,
        data.role_type,
        data.is_registered_address,
      ]
    );
    return result.rows[0];
  },

  async getCompanyContacts(companyId: number) {
    const result = await pool.query(
      `SELECT c.*, cc.role_type, cc.is_registered_address
       FROM contacts c
       JOIN company_contacts cc ON c.id = cc.contact_id
       WHERE cc.company_id = $1`,
      [companyId]
    );
    return result.rows;
  },

  async removeContact(companyId: number, contactId: number) {
    await pool.query(
      'DELETE FROM company_contacts WHERE company_id = $1 AND contact_id = $2',
      [companyId, contactId]
    );
  },
};

// Business certificate operations
export const businessCertificateDB = {
  async create(data: Omit<BusinessCertificate, 'id' | 'created_at' | 'updated_at'>) {
    const result = await pool.query(
      `INSERT INTO business_certificates (
        company_id, contact_id, phone, email
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        data.company_id,
        data.contact_id,
        data.phone,
        data.email,
      ]
    );
    return result.rows[0];
  },

  async getCompanyCertificates(companyId: number) {
    const result = await pool.query(
      `SELECT bc.*, c.name as contact_name
       FROM business_certificates bc
       JOIN contacts c ON bc.contact_id = c.id
       WHERE bc.company_id = $1`,
      [companyId]
    );
    return result.rows;
  },
}; 