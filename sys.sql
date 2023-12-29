use hust_airline;
CREATE TABLE users (
    user_id int primary key,
    user_name varchar(50),
    user_password varchar(50),
    user_mobile varchar(50),
    user_email varchar(50),
    user_address varchar(100)
);
insert into users
values(
        1,
        'Lan',
        '123',
        '0321554618',
        'Lancute@gmail.com',
        'Ha Dong, Ha Noi'
    );
CREATE TABLE admins (
    admin_id int primary key,
    admin_username varchar(50),
    admin_password varchar(50)
);
INSERT INTO admins
VALUES(1, 'ADMIN', 'admin');
CREATE TABLE flights (
    f_id int primary key,
    f_number varchar(50),
    f_type varchar(50),
    f_date varchar(50),
    f_source varchar(50),
    f_dest varchar(50),
    f_dept_time varchar(50),
    f_arr_time varchar(50),
    f_fare int,
    f_remseats int
);
INSERT INTO flights
values (
        1,
        '33527',
        'Economic',
        '2024-01-20',
        'Ha Noi',
        'Ho Chi Minh',
        '12:00',
        '16:00',
        500000,
        70
    );
CREATE TABLE bookings (
    b_id int primary key,
    b_user_id int,
    b_f_id int,
    b_f_number int,
    b_f_type varchar(50),
    b_f_date varchar(50),
    b_pas_name varchar(50),
    b_pas_age varchar(50),
    b_pas_gender varchar(50)
);
ALTER TABLE bookings
add constraint flights_fk foreign key (b_f_id) references flights(f_id) on delete cascade;
ALTER TABLE bookings
add constraint user_fk foreign key (b_user_id) references users(user_id) on delete cascade;