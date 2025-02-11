# FastAPI TikTok Affiliate Service

This FastAPI-based service interacts with TikTok's Affiliate Creator Marketplace API to fetch creators and their profiles. It uses Prisma for database management and `httpx` for making asynchronous HTTP requests.

## Features
- Fetch creators from the TikTok affiliate marketplace
- Retrieve detailed creator profiles
- Uses Prisma ORM for database interactions
- Supports multiple countries with stored authentication cookies

## Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.13+
- PostgreSQL database
- Prisma ORM
- FastAPI and required dependencies

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Create and activate a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**
   Copy `.env.example` to `.env` and update the required values.
   ```sh
   cp .env.example .env
   ```

5. **Run database migrations:**
   ```sh
   prisma migrate dev --name init
   ```

6. **Generate Prisma client:**
   ```sh
   prisma generate
   ```

## Running the Service
To start the FastAPI server:
```sh
uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### **1. Get Creators**
Fetches a list of creators from TikTok’s affiliate marketplace.

- **Endpoint:** `GET /find_creators`
- **Query Parameters:**
  - `country` (string, default: `US`) – Country code
  - `page` (int, default: `1`) – Pagination page number
- **Response:** JSON object with creator details

**Example Request:**
```sh
curl -X GET "http://localhost:8000/find_creators?country=US&page=1"
```

---

### **2. Get Creator Profile**
Fetches a detailed profile of a creator.

- **Endpoint:** `GET /creator_profile`
- **Query Parameters:**
  - `country` (string) – Country code
  - `creator_id` (string) – Unique Creator ID
  - `profile_type` (int) – Profile type (range: 1-5)
- **Response:** JSON object with creator profile details

**Example Request:**
```sh
curl -X GET "http://localhost:8000/creator_profile?country=US&creator_id=12345&profile_type=2"
```

## Project Structure
```
/your-repo
│── src/
│   ├── server.py            # FastAPI app entry point
│   ├── api_client.py        # Handles external API requests
│   ├── service.py           # Business logic functions
│   ├── config/
│   │   ├── connection.py    # Prisma DB connection
│   │   ├── settings.py      # Environment configurations
│── prisma/
│   ├── schema.prisma        # Prisma ORM schema
│── .env                     # Environment variables
│── requirements.txt         # Python dependencies
│── README.md                # Documentation
```

## Deployment
For production, consider using **Docker** or deploying via **Gunicorn**:
```sh
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.server:app
```

## Contributing
Feel free to open issues and pull requests to improve this project!

## License
MIT License