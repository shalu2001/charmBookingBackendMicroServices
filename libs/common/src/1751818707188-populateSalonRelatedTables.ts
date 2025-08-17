import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSalonRelatedTables1751818707188
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Populate salon table
    await queryRunner.query(`
      INSERT INTO salon (name, ownerName, location, phone, email, website, description, longitude, latitude)
      VALUES 
      ('Elegant Salon', 'Alice Johnson', '123 Main St, Cityville', '123-456-7890', 'elegant@example.com', 'www.elegantsalon.com', 'A luxurious salon offering premium services.', -74.00597, 40.71278),
      ('Modern Cuts', 'Bob Smith', '456 Elm St, Townsville', '987-654-3210', 'moderncuts@example.com', 'www.moderncuts.com', 'A trendy salon specializing in modern hairstyles.', -73.98513, 40.75890),
      ('Classic Beauty', 'Catherine Lee', '789 Oak St, Villagetown', '555-123-4567', 'classicbeauty@example.com', 'www.classicbeauty.com', 'A classic salon with a focus on timeless beauty.', -74.01197, 40.70589),
      ('Urban Style', 'David Brown', '321 Pine St, Metropolis', '444-987-6543', 'urbanstyle@example.com', 'www.urbanstyle.com', 'An urban salon with cutting-edge styles.', -73.99429, 40.74844),
      ('Nature Spa', 'Emma Green', '654 Maple St, Countryside', '333-456-7890', 'naturespa@example.com', 'www.naturespa.com', 'A relaxing spa with natural treatments.', -74.02651, 40.69467);
    `);

    // Populate salon_category table
    await queryRunner.query(`
      INSERT INTO salon_category (name)
      VALUES 
      ('Hair Styling'),
      ('Facial Treatments'),
      ('Manicure & Pedicure'),
      ('Massage Therapy'),
      ('Waxing');
    `);

    // Populate salon_service table
    await queryRunner.query(`
      INSERT INTO salon_service (name, price, duration)
      VALUES 
      ('Basic Haircut', 20, 30),
      ('Deluxe Facial', 50, 60),
      ('Manicure', 25, 45),
      ('Full Body Massage', 80, 90),
      ('Eyebrow Waxing', 15, 15);
    `);

    // Populate salon_services join table (salon_id, service_id)
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

    // Populate salon_service_categories join table (serviceId, categoryId)
    await queryRunner.query(`
      INSERT INTO salon_service_categories (serviceId, categoryId)
      VALUES 
      ((SELECT serviceId FROM salon_service WHERE name = 'Basic Haircut'), (SELECT categoryId FROM salon_category WHERE name = 'Hair Styling')),
      ((SELECT serviceId FROM salon_service WHERE name = 'Deluxe Facial'), (SELECT categoryId FROM salon_category WHERE name = 'Facial Treatments')),
      ((SELECT serviceId FROM salon_service WHERE name = 'Manicure'), (SELECT categoryId FROM salon_category WHERE name = 'Manicure & Pedicure')),
      ((SELECT serviceId FROM salon_service WHERE name = 'Full Body Massage'), (SELECT categoryId FROM salon_category WHERE name = 'Massage Therapy')),
      ((SELECT serviceId FROM salon_service WHERE name = 'Eyebrow Waxing'), (SELECT categoryId FROM salon_category WHERE name = 'Waxing'));
    `);

    //populate salon_review table
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback salon_service_categories join table
    await queryRunner.query(`
      DELETE FROM salon_service_categories WHERE serviceId IN (
        (SELECT serviceId FROM salon_service WHERE name IN ('Basic Haircut', 'Deluxe Facial', 'Manicure', 'Full Body Massage', 'Eyebrow Waxing'))
      );
    `);

    // Rollback salon_services join table
    await queryRunner.query(`
      DELETE FROM salon_services WHERE salon_id IN (
        (SELECT id FROM salon WHERE name IN ('Elegant Salon', 'Modern Cuts', 'Classic Beauty', 'Urban Style', 'Nature Spa'))
      );
    `);

    // Rollback salon_service table
    await queryRunner.query(`
      DELETE FROM salon_service WHERE name IN ('Basic Haircut', 'Deluxe Facial', 'Manicure', 'Full Body Massage', 'Eyebrow Waxing');
    `);

    // Rollback salon_category table
    await queryRunner.query(`
      DELETE FROM salon_category WHERE name IN ('Hair Styling', 'Facial Treatments', 'Manicure & Pedicure', 'Massage Therapy', 'Waxing');
    `);

    // Rollback salon table
    await queryRunner.query(`
      DELETE FROM salon WHERE name IN ('Elegant Salon', 'Modern Cuts', 'Classic Beauty', 'Urban Style', 'Nature Spa');
    `);
  }
}
