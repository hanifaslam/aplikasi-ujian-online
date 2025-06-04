# Aplikasi Ujian Online

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)

A modern online examination system built with Laravel, React, and Inertia.js, featuring an elegant UI powered by shadcn/ui components and Tailwind CSS.

## Features

- 🔐 User authentication
- 📝 Exam creation and management
- 👥 Student management
- 📊 Real-time monitoring of exams
- 📝 Multiple question types (multiple choice, essay, etc.)
- 📈 Comprehensive result reporting and analysis
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui components
- **Backend**: Laravel 12, PHP 8.2+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **State Management**: Inertia.js
- **Styling**: Tailwind CSS with custom theme configuration

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm
- MySQL

### Installation

1. Clone the repository

```bash
git clone https://github.com/KidiXDev/aplikasi-ujian-online.git
cd aplikasi-ujian-online
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
npm install
```

4. Set up environment variables

```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database connection in the `.env` file

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

6. Run migrations and seeders

```bash
php artisan migrate --seed
```

7. Build assets

```bash
npm run build
```

8. Start the development server

```bash
php artisan serve
```

9. (Optional) For hot module replacement during development

```bash
npm run dev
```

There are two users who have different roles, admin and super admin.

```bash
Super Admin
Email: admin@admin.com
Password: admin123
```

```bash
Admin
Email: test@admin.com
Password: admin123
```

### Using the All-in-One Development Command

To start the server, queue worker, and Vite dev server all at once:

```bash
composer dev
```

Or with SSR:

```bash
composer dev:ssr
```

## Project Structure

```plaintext
├── app/                  # PHP application code
├── bootstrap/            # Laravel bootstrap files
├── config/               # Configuration files
├── database/             # Database migrations and seeds
├── public/               # Public assets
├── resources/
│   ├── css/              # CSS files
│   ├── js/               # JavaScript and React components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Page layouts
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── views/            # Blade views
├── routes/               # Route definitions
├── storage/              # Application storage
└── tests/                # Test files
```

## Development

### Running Tests

```bash
php artisan test
```

## Deployment

For production deployment:

```bash
# Build assets for production
npm run build

# For server-side rendering
npm run build:ssr
```

## Contributing (Important)

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Laravel](https://laravel.com) - The PHP framework
- [React](https://react.dev) - The JavaScript library
- [Tailwind CSS](https://tailwindcss.com) - The CSS framework
- [Inertia.js](https://inertiajs.com) - The modern monolith approach
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Lucide Icons](https://lucide.dev) - Beautiful icons

This project is dedicated to fulfill the Project Based Learning (PBL) assignment at our college.
