#  Resume RAG Assistant

An AI-powered **Resume RAG Assistant** that allows users to upload their resume and ask questions about their skills, education, projects, experience, and other resume information using **Retrieval-Augmented Generation (RAG)**.

The system uses **embeddings + vector search + LLMs** to retrieve relevant information from the resume before generating an answer.

##  Features

*  Upload and process resume PDFs
*  Semantic search over resume content
*  Retrieval-Augmented Generation (RAG)
*  Chat with your resume using natural language
*  Retrieve relevant resume sections
*  MCP server and tools integration
*  Vector database for storing embeddings
*  JavaScript/Node.js backend
*  Environment-variable based API key management
*  Docker support
*  REST API support

## Architecture

```text
                  ┌─────────────────┐
                  │   Resume PDF    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Text Extraction│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Chunking     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Embeddings    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Vector Database│
                  └────────┬────────┘
                           │
            User Question │
                           ▼
                  ┌─────────────────┐
                  │ Semantic Search │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Relevant Context│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │       LLM       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │      Answer     │
                  └─────────────────┘
```

##  How RAG Works

The application follows these steps:

1. User uploads a resume.
2. The PDF text is extracted.
3. The extracted text is divided into smaller chunks.
4. Each chunk is converted into an embedding.
5. Embeddings are stored in a vector database.
6. User asks a question.
7. The system performs semantic similarity search.
8. Relevant resume chunks are retrieved.
9. Retrieved context is sent to the LLM.
10. The LLM generates an answer based on the resume.

### Example

**User:**

```text
What projects have I worked on?
```

**RAG System:**

```text
1. Resume RAG Assistant
2. House Price Prediction
3. Fake News Detection
...
```

Another example:

```text
Do I have experience with JavaScript?
```

The system searches the resume and generates an answer using the relevant information.

##  Tech Stack

### Backend

* Node.js
* JavaScript
* Express.js
* REST API

### AI / RAG

* Large Language Model (LLM)
* Embeddings
* Retrieval-Augmented Generation
* Semantic Search

### Database

* PostgreSQL
* pgvector

### MCP

* MCP Server
* Custom resume-related tools

### DevOps

* Docker
* Docker Compose
* GitHub

##  Project Structure

```text
resume-rag-assistant/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── mcp-server/
│   ├── tools/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── uploads/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-rag-assistant.git
```

```bash
cd resume-rag-assistant
```

### 2. Install dependencies

```bash
npm install
```

If the project has separate frontend and backend folders:

```bash
cd backend
npm install
```

and:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

LLM_API_KEY=your_api_key

VECTOR_DATABASE_URL=your_vector_database_url
```

>  Never upload your `.env` file to GitHub.

Use `.env.example` instead:

```env
PORT=
DATABASE_URL=
LLM_API_KEY=
VECTOR_DATABASE_URL=
```

##  Run with Docker

Make sure Docker Desktop is running.

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop the containers:

```bash
docker compose down
```

##  Run the Backend

```bash
cd backend
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

##  API Endpoints

### Health Check

```http
GET /health
```

### Upload Resume

```http
POST /api/resume/upload
```

### Ask Question

```http
POST /api/chat/ask
```

Example request:

```json
{
  "question": "What skills are mentioned in my resume?"
}
```

Example response:

```json
{
  "answer": "Your resume contains skills including JavaScript, Python, SQL, HTML and CSS."
}
```

##  MCP Tools

The MCP server can expose tools such as:

```text
search_resume
get_skills
get_projects
get_experience
get_education
analyze_resume
```

For example:

```text
User
 ↓
"What projects are in my resume?"
 ↓
MCP Tool
 ↓
search_resume
 ↓
Vector Database
 ↓
Relevant Resume Content
 ↓
LLM
 ↓
Answer
```

##  Security

Sensitive credentials should be stored in environment variables.

Do **not** commit:

```text
.env
.env.local
API keys
Database passwords
Private credentials
```

Add them to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
uploads/
dist/
.next/
```

##  Future Improvements

* [ ] Multiple resume support
* [ ] Resume comparison
* [ ] Job description matching
* [ ] ATS score
* [ ] Skill-gap analysis
* [ ] Resume improvement suggestions
* [ ] Interview question generation
* [ ] Authentication
* [ ] User dashboard
* [ ] Chat history
* [ ] Streaming AI responses
* [ ] Cloud deployment
* [ ] Advanced MCP agents

##  Use Cases

Resume RAG Assistant can be used for:

* Resume analysis
* Job matching
* Interview preparation
* Skill analysis
* Career assistance
* ATS optimization
* Resume question answering

##  What This Project Demonstrates

This project demonstrates practical knowledge of:

* Generative AI
* LLMs
* RAG
* Embeddings
* Vector databases
* Semantic search
* MCP
* REST APIs
* Node.js
* PostgreSQL
* Docker
* Backend architecture

##  Author

**Shobhit Shukla**

B.Tech – Information Technology

##  Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

**Built with ❤️ using JavaScript, RAG, Vector Search, LLMs and MCP.**
