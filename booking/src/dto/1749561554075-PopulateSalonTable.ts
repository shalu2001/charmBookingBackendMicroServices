import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSalonTable1749561554075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Populate salon table
    await queryRunner.query(`
        INSERT INTO salon (name, ownerName, location, phone, email, website, description)
        VALUES 
        ('Elegant Salon', 'Alice Johnson', '123 Main St, Cityville', '123-456-7890', 'elegant@example.com', 'www.elegantsalon.com', 'A luxurious salon offering premium services.'),
        ('Modern Cuts', 'Bob Smith', '456 Elm St, Townsville', '987-654-3210', 'moderncuts@example.com', 'www.moderncuts.com', 'A trendy salon specializing in modern hairstyles.'),
        ('Classic Beauty', 'Catherine Lee', '789 Oak St, Villagetown', '555-123-4567', 'classicbeauty@example.com', 'www.classicbeauty.com', 'A classic salon with a focus on timeless beauty.'),
        ('Urban Style', 'David Brown', '321 Pine St, Metropolis', '444-987-6543', 'urbanstyle@example.com', 'www.urbanstyle.com', 'An urban salon with cutting-edge styles.'),
        ('Nature Spa', 'Emma Green', '654 Maple St, Countryside', '333-456-7890', 'naturespa@example.com', 'www.naturespa.com', 'A relaxing spa with natural treatments.');
    `);

    // Populate salon_categories table
    await queryRunner.query(`
        INSERT INTO salon_category (name)
        VALUES 
        ('Hair Styling'),
        ('Facial Treatments'),
        ('Manicure & Pedicure'),
        ('Massage Therapy'),
        ('Waxing');
    `);

    // Populate salon_services table
    await queryRunner.query(`
        INSERT INTO salon_service (name, price, duration)
        VALUES 
        ('Basic Haircut', 20, 30),
        ('Deluxe Facial', 50, 60),
        ('Manicure', 25, 45),
        ('Full Body Massage', 80, 90),
        ('Eyebrow Waxing', 15, 15);
    `);

    // Populate salon_categories join table using subqueries
    await queryRunner.query(`
        INSERT INTO salon_categories (salon_id, category_id)
        VALUES 
        ((SELECT id FROM salon WHERE name = 'Elegant Salon'), (SELECT categoryId FROM salon_category WHERE name = 'Hair Styling')),
        ((SELECT id FROM salon WHERE name = 'Elegant Salon'), (SELECT categoryId FROM salon_category WHERE name = 'Facial Treatments')),
        ((SELECT id FROM salon WHERE name = 'Modern Cuts'), (SELECT categoryId FROM salon_category WHERE name = 'Hair Styling')),
        ((SELECT id FROM salon WHERE name = 'Modern Cuts'), (SELECT categoryId FROM salon_category WHERE name = 'Manicure & Pedicure')),
        ((SELECT id FROM salon WHERE name = 'Classic Beauty'), (SELECT categoryId FROM salon_category WHERE name = 'Massage Therapy')),
        ((SELECT id FROM salon WHERE name = 'Urban Style'), (SELECT categoryId FROM salon_category WHERE name = 'Waxing')),
        ((SELECT id FROM salon WHERE name = 'Nature Spa'), (SELECT categoryId FROM salon_category WHERE name = 'Facial Treatments')),
        ((SELECT id FROM salon WHERE name = 'Nature Spa'), (SELECT categoryId FROM salon_category WHERE name = 'Massage Therapy'));
    `);

    // Populate salon_services join table using subqueries
    await queryRunner.query(`
        INSERT INTO salon_services (salon_id, service_id)
        VALUES 
        ((SELECT id FROM salon WHERE name = 'Elegant Salon'), (SELECT serviceId FROM salon_service WHERE name = 'Basic Haircut')),
        ((SELECT id FROM salon WHERE name = 'Elegant Salon'), (SELECT serviceId FROM salon_service WHERE name = 'Deluxe Facial')),
        ((SELECT id FROM salon WHERE name = 'Modern Cuts'), (SELECT serviceId FROM salon_service WHERE name = 'Basic Haircut')),
        ((SELECT id FROM salon WHERE name = 'Modern Cuts'), (SELECT serviceId FROM salon_service WHERE name = 'Manicure')),
        ((SELECT id FROM salon WHERE name = 'Classic Beauty'), (SELECT serviceId FROM salon_service WHERE name = 'Full Body Massage')),
        ((SELECT id FROM salon WHERE name = 'Urban Style'), (SELECT serviceId FROM salon_service WHERE name = 'Eyebrow Waxing')),
        ((SELECT id FROM salon WHERE name = 'Nature Spa'), (SELECT serviceId FROM salon_service WHERE name = 'Deluxe Facial')),
        ((SELECT id FROM salon WHERE name = 'Nature Spa'), (SELECT serviceId FROM salon_service WHERE name = 'Full Body Massage'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback salon_services join table data
    await queryRunner.query(`
        DELETE FROM salon_services WHERE salon_id IN (
            (SELECT id FROM salon WHERE name = 'Elegant Salon'),
            (SELECT id FROM salon WHERE name = 'Modern Cuts'),
            (SELECT id FROM salon WHERE name = 'Classic Beauty'),
            (SELECT id FROM salon WHERE name = 'Urban Style'),
            (SELECT id FROM salon WHERE name = 'Nature Spa')
        );
    `);

    // Rollback salon_categories join table data
    await queryRunner.query(`
        DELETE FROM salon_categories WHERE salon_id IN (
            (SELECT id FROM salon WHERE name = 'Elegant Salon'),
            (SELECT id FROM salon WHERE name = 'Modern Cuts'),
            (SELECT id FROM salon WHERE name = 'Classic Beauty'),
            (SELECT id FROM salon WHERE name = 'Urban Style'),
            (SELECT id FROM salon WHERE name = 'Nature Spa')
        );
    `);

    // Rollback salon_service data
    await queryRunner.query(`
        DELETE FROM salon_service WHERE name IN (
            'Basic Haircut',
            'Deluxe Facial',
            'Manicure',
            'Full Body Massage',
            'Eyebrow Waxing'
        );
    `);

    // Rollback salon_category data
    await queryRunner.query(`
        DELETE FROM salon_category WHERE name IN (
            'Hair Styling',
            'Facial Treatments',
            'Manicure & Pedicure',
            'Massage Therapy',
            'Waxing'
        );
    `);

    // Rollback salon data
    await queryRunner.query(`
        DELETE FROM salon WHERE email IN (
            'elegant@example.com',
            'moderncuts@example.com',
            'classicbeauty@example.com',
            'urbanstyle@example.com',
            'naturespa@example.com'
        );
    `);
  }
}
