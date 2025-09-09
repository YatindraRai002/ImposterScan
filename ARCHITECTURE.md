# 🏗️ System Architecture & Technical Documentation

## 🌐 Complete System Architecture

### Master Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    subgraph "🖥️ Client Layer"
        WEB["🌐 Web Browser<br/>React SPA"]
        MOBILE["📱 Mobile App<br/>React Native"]
        API_CLIENT["🔌 API Clients<br/>Third-party"]
        CLI["💻 CLI Tool<br/>Python CLI"]
    end
    
    %% Load Balancer & Edge
    subgraph "⚡ Edge & Load Balancing"
        CDN["🌍 CDN<br/>Static Assets"]
        WAF["🛡️ Web Application Firewall<br/>Security Filter"]
        LB["⚖️ Load Balancer<br/>Nginx/HAProxy"]
        RATE["🚦 Rate Limiter<br/>Redis-based"]
    end
    
    %% API Gateway
    subgraph "🚪 API Gateway Layer"
        GATEWAY["🚪 API Gateway<br/>Flask/FastAPI"]
        AUTH["🔐 Authentication<br/>JWT/OAuth2"]
        AUTHZ["🔒 Authorization<br/>RBAC"]
        VALID["✅ Request Validation<br/>Schema Validation"]
    end
    
    %% Application Services
    subgraph "🏢 Application Services"
        UPLOAD["📤 Upload Service<br/>File Management"]
        ANALYSIS["🔍 Analysis Service<br/>Job Orchestration"]
        NOTIFY["📢 Notification Service<br/>WebSocket/Email"]
        USER["👤 User Service<br/>Profile Management"]
        REPORT["📊 Reporting Service<br/>Analytics"]
    end
    
    %% AI/ML Processing
    subgraph "🧠 AI/ML Processing Engine"
        PREPROCESS["🔧 Preprocessor<br/>Media Normalization"]
        FEATURE["🎯 Feature Extractor<br/>CNN/Audio/Video"]
        
        subgraph "🤖 ML Models"
            IMG_MODEL["🖼️ Image Models<br/>CNN/Vision"]
            VID_MODEL["🎬 Video Models<br/>Temporal/3D CNN"]
            AUD_MODEL["🔊 Audio Models<br/>Spectral/RNN"]
        end
        
        ENSEMBLE["🎭 Ensemble Engine<br/>Model Fusion"]
        INFERENCE["⚡ Inference Engine<br/>GPU Accelerated"]
    end
    
    %% Data & Storage
    subgraph "🗄️ Data & Storage Layer"
        POSTGRES["🐘 PostgreSQL<br/>Metadata & Jobs"]
        REDIS["🔴 Redis Cache<br/>Session & Cache"]
        S3["☁️ Object Storage<br/>Files & Models"]
        ELASTIC["🔍 Elasticsearch<br/>Logs & Search"]
    end
    
    %% Message Queue
    subgraph "📬 Message Queue"
        QUEUE["📨 Job Queue<br/>Celery/RQ"]
        WORKER["⚙️ Worker Nodes<br/>Background Processing"]
        SCHEDULER["⏰ Task Scheduler<br/>Cron/APScheduler"]
    end
    
    %% Monitoring & Observability
    subgraph "📊 Monitoring & Observability"
        METRICS["📈 Metrics<br/>Prometheus"]
        LOGS["📝 Logging<br/>ELK Stack"]
        TRACE["🔍 Tracing<br/>Jaeger"]
        ALERT["🚨 Alerting<br/>AlertManager"]
        DASH["📊 Dashboards<br/>Grafana"]
    end
    
    %% Infrastructure
    subgraph "🏗️ Infrastructure Layer"
        DOCKER["🐳 Containers<br/>Docker"]
        K8S["☸️ Orchestration<br/>Kubernetes"]
        HELM["⚓ Package Manager<br/>Helm Charts"]
        SECRETS["🔐 Secret Management<br/>Vault/K8s Secrets"]
    end
    
    %% External Services
    subgraph "🌐 External Services"
        EMAIL["📧 Email Service<br/>SendGrid/SES"]
        SMS["📱 SMS Service<br/>Twilio"]
        STORAGE_EXT["☁️ Cloud Storage<br/>AWS S3/GCS"]
        MONITOR_EXT["📊 External Monitoring<br/>DataDog/NewRelic"]
    end
    
    %% Connections - Client to Edge
    WEB --> CDN
    MOBILE --> WAF
    API_CLIENT --> LB
    CLI --> RATE
    
    %% Edge to Gateway
    CDN --> GATEWAY
    WAF --> AUTH
    LB --> AUTHZ
    RATE --> VALID
    
    %% Gateway to Services
    GATEWAY --> UPLOAD
    AUTH --> ANALYSIS
    AUTHZ --> NOTIFY
    VALID --> USER
    GATEWAY --> REPORT
    
    %% Services to ML
    UPLOAD --> PREPROCESS
    ANALYSIS --> FEATURE
    PREPROCESS --> IMG_MODEL
    FEATURE --> VID_MODEL
    FEATURE --> AUD_MODEL
    IMG_MODEL --> ENSEMBLE
    VID_MODEL --> ENSEMBLE
    AUD_MODEL --> ENSEMBLE
    ENSEMBLE --> INFERENCE
    
    %% Services to Data
    UPLOAD --> S3
    ANALYSIS --> POSTGRES
    USER --> REDIS
    REPORT --> ELASTIC
    
    %% Queue System
    ANALYSIS --> QUEUE
    QUEUE --> WORKER
    WORKER --> INFERENCE
    WORKER --> SCHEDULER
    
    %% Monitoring Connections
    GATEWAY -.-> METRICS
    UPLOAD -.-> LOGS
    ANALYSIS -.-> TRACE
    INFERENCE -.-> ALERT
    METRICS --> DASH
    
    %% Infrastructure
    GATEWAY --- DOCKER
    UPLOAD --- K8S
    ANALYSIS --- HELM
    USER --- SECRETS
    
    %% External Services
    NOTIFY --> EMAIL
    NOTIFY --> SMS
    S3 --> STORAGE_EXT
    METRICS --> MONITOR_EXT
    
    %% Styling
    classDef clientStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef edgeStyle fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef gatewayStyle fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef serviceStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef mlStyle fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    classDef dataStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef queueStyle fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef monitorStyle fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    classDef infraStyle fill:#efebe9,stroke:#3e2723,stroke-width:2px
    classDef externalStyle fill:#fafafa,stroke:#424242,stroke-width:2px
    
    class WEB,MOBILE,API_CLIENT,CLI clientStyle
    class CDN,WAF,LB,RATE edgeStyle
    class GATEWAY,AUTH,AUTHZ,VALID gatewayStyle
    class UPLOAD,ANALYSIS,NOTIFY,USER,REPORT serviceStyle
    class PREPROCESS,FEATURE,IMG_MODEL,VID_MODEL,AUD_MODEL,ENSEMBLE,INFERENCE mlStyle
    class POSTGRES,REDIS,S3,ELASTIC dataStyle
    class QUEUE,WORKER,SCHEDULER queueStyle
    class METRICS,LOGS,TRACE,ALERT,DASH monitorStyle
    class DOCKER,K8S,HELM,SECRETS infraStyle
    class EMAIL,SMS,STORAGE_EXT,MONITOR_EXT externalStyle
```

## 📊 Detailed Layer Architecture

### 1. Complete Data Flow Architecture

```mermaid
flowchart TD
    %% Start
    START(["🚀 User Initiates Analysis"])
    
    %% Client Actions
    subgraph "📱 Client Layer"
        UPLOAD_UI["📤 Upload Interface<br/>File Selection"]
        VALIDATE_CLIENT["✅ Client Validation<br/>Size/Format Check"]
        PROGRESS_UI["📊 Progress Tracking<br/>Real-time Updates"]
    end
    
    %% Gateway Processing
    subgraph "🚪 Gateway Layer"
        AUTH_CHECK["🔐 Authentication<br/>JWT Validation"]
        RATE_LIMIT["🚦 Rate Limiting<br/>User/IP Limits"]
        REQUEST_VALID["✅ Request Validation<br/>Schema/Security"]
    end
    
    %% File Processing
    subgraph "📁 File Processing"
        FILE_RECEIVE["📥 File Reception<br/>Multipart Upload"]
        VIRUS_SCAN["🦠 Security Scan<br/>Malware Detection"]
        FILE_STORE["💾 File Storage<br/>Secure Location"]
        METADATA_EXTRACT["🏷️ Metadata Extraction<br/>EXIF/Format Info"]
    end
    
    %% Job Management
    subgraph "⚙️ Job Management"
        JOB_CREATE["📝 Job Creation<br/>Database Record"]
        QUEUE_ADD["📬 Queue Addition<br/>Priority Assignment"]
        WORKER_ASSIGN["👷 Worker Assignment<br/>Load Balancing"]
    end
    
    %% AI Processing Pipeline
    subgraph "🧠 AI Processing Pipeline"
        PRE_PROCESS["🔧 Preprocessing<br/>Normalization"]
        
        subgraph "🎯 Feature Extraction"
            IMG_FEAT["🖼️ Image Features<br/>CNN/ResNet"]
            VID_FEAT["🎬 Video Features<br/>Temporal/Motion"]
            AUD_FEAT["🔊 Audio Features<br/>Spectral/MFCC"]
        end
        
        subgraph "🤖 Model Inference"
            IMG_PRED["🖼️ Image Prediction<br/>Deepfake Classifier"]
            VID_PRED["🎬 Video Prediction<br/>Temporal Analyzer"]
            AUD_PRED["🔊 Audio Prediction<br/>Voice Synthesis"]
        end
        
        ENSEMBLE["🎭 Ensemble Fusion<br/>Multi-model Voting"]
        CONFIDENCE["📊 Confidence Calculation<br/>Uncertainty Estimation"]
        EVIDENCE["🔍 Evidence Generation<br/>Explanation Maps"]
    end
    
    %% Result Processing
    subgraph "📊 Result Processing"
        RESULT_COMPILE["📋 Result Compilation<br/>JSON Response"]
        DB_STORE["💾 Database Storage<br/>Results & Metadata"]
        CACHE_UPDATE["⚡ Cache Update<br/>Performance Optimization"]
    end
    
    %% Notification & Response
    subgraph "📢 Notification System"
        WEBSOCKET["🔌 WebSocket Push<br/>Real-time Updates"]
        EMAIL_NOTIFY["📧 Email Notification<br/>Completion Alert"]
        SMS_NOTIFY["📱 SMS Notification<br/>Critical Results"]
    end
    
    %% Response Delivery
    subgraph "📤 Response Delivery"
        API_RESPONSE["🔗 API Response<br/>JSON/HTTP"]
        UI_UPDATE["🖥️ UI Update<br/>Result Display"]
        REPORT_GEN["📄 Report Generation<br/>PDF/Export"]
    end
    
    %% End States
    SUCCESS(["✅ Analysis Complete"])
    ERROR(["❌ Error Handling"])
    
    %% Flow Connections
    START --> UPLOAD_UI
    UPLOAD_UI --> VALIDATE_CLIENT
    VALIDATE_CLIENT --> AUTH_CHECK
    AUTH_CHECK --> RATE_LIMIT
    RATE_LIMIT --> REQUEST_VALID
    REQUEST_VALID --> FILE_RECEIVE
    
    FILE_RECEIVE --> VIRUS_SCAN
    VIRUS_SCAN --> FILE_STORE
    FILE_STORE --> METADATA_EXTRACT
    METADATA_EXTRACT --> JOB_CREATE
    
    JOB_CREATE --> QUEUE_ADD
    QUEUE_ADD --> WORKER_ASSIGN
    WORKER_ASSIGN --> PRE_PROCESS
    
    PRE_PROCESS --> IMG_FEAT
    PRE_PROCESS --> VID_FEAT
    PRE_PROCESS --> AUD_FEAT
    
    IMG_FEAT --> IMG_PRED
    VID_FEAT --> VID_PRED
    AUD_FEAT --> AUD_PRED
    
    IMG_PRED --> ENSEMBLE
    VID_PRED --> ENSEMBLE
    AUD_PRED --> ENSEMBLE
    
    ENSEMBLE --> CONFIDENCE
    CONFIDENCE --> EVIDENCE
    EVIDENCE --> RESULT_COMPILE
    
    RESULT_COMPILE --> DB_STORE
    DB_STORE --> CACHE_UPDATE
    CACHE_UPDATE --> WEBSOCKET
    
    WEBSOCKET --> EMAIL_NOTIFY
    EMAIL_NOTIFY --> SMS_NOTIFY
    SMS_NOTIFY --> API_RESPONSE
    
    API_RESPONSE --> UI_UPDATE
    UI_UPDATE --> REPORT_GEN
    REPORT_GEN --> SUCCESS
    
    %% Error Flows
    VALIDATE_CLIENT -.-> ERROR
    AUTH_CHECK -.-> ERROR
    VIRUS_SCAN -.-> ERROR
    PRE_PROCESS -.-> ERROR
    ENSEMBLE -.-> ERROR
    
    %% Progress Updates
    JOB_CREATE -.-> PROGRESS_UI
    PRE_PROCESS -.-> PROGRESS_UI
    ENSEMBLE -.-> PROGRESS_UI
    RESULT_COMPILE -.-> PROGRESS_UI
    
    %% Styling
    classDef startEnd fill:#4caf50,stroke:#2e7d32,stroke-width:3px,color:white
    classDef client fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef gateway fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef file fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef job fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ai fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef result fill:#e0f2f1,stroke:#00796b,stroke-width:2px
    classDef notify fill:#fff8e1,stroke:#fbc02d,stroke-width:2px
    classDef response fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class START,SUCCESS startEnd
    class ERROR error
    class UPLOAD_UI,VALIDATE_CLIENT,PROGRESS_UI client
    class AUTH_CHECK,RATE_LIMIT,REQUEST_VALID gateway
    class FILE_RECEIVE,VIRUS_SCAN,FILE_STORE,METADATA_EXTRACT file
    class JOB_CREATE,QUEUE_ADD,WORKER_ASSIGN job
    class PRE_PROCESS,IMG_FEAT,VID_FEAT,AUD_FEAT,IMG_PRED,VID_PRED,AUD_PRED,ENSEMBLE,CONFIDENCE,EVIDENCE ai
    class RESULT_COMPILE,DB_STORE,CACHE_UPDATE result
    class WEBSOCKET,EMAIL_NOTIFY,SMS_NOTIFY notify
    class API_RESPONSE,UI_UPDATE,REPORT_GEN response
```

## 📊 High-Level Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[React/HTML5 Interface]
        C[Mobile App] --> D[React Native]
        E[API Clients] --> F[REST/GraphQL]
    end
    
    subgraph "Load Balancer & Gateway"
        G[Nginx Load Balancer]
        H[API Gateway]
        I[Rate Limiting]
    end
    
    subgraph "Application Layer"
        J[Flask Application]
        K[Authentication Service]
        L[File Upload Handler]
        M[Analysis Orchestrator]
    end
    
    subgraph "AI/ML Processing Layer"
        N[Image Detection Engine]
        O[Video Analysis Engine]
        P[Audio Detection Engine]
        Q[Model Manager]
        R[Feature Extractor]
    end
    
    subgraph "Data Layer"
        S[PostgreSQL Database]
        T[Redis Cache]
        U[File Storage System]
        V[Model Repository]
    end
    
    subgraph "Infrastructure Layer"
        W[Docker Containers]
        X[Kubernetes Orchestration]
        Y[Monitoring & Logging]
        Z[Security Scanner]
    end
    
    B --> G
    D --> H
    F --> I
    G --> J
    H --> K
    I --> L
    J --> M
    M --> N
    M --> O
    M --> P
    N --> Q
    O --> R
    P --> Q
    Q --> S
    R --> T
    T --> U
    U --> V
    J --> W
    W --> X
    X --> Y
    Y --> Z
```

## 🔧 Component Architecture

### 1. Frontend Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        A[App Shell] --> B[Router]
        B --> C[Upload Component]
        B --> D[Results Component]
        B --> E[Dashboard Component]
        
        C --> F[Drag & Drop Zone]
        C --> G[File Validator]
        C --> H[Progress Tracker]
        
        D --> I[Visualization Charts]
        D --> J[Confidence Meters]
        D --> K[Export Options]
        
        E --> L[Analytics Dashboard]
        E --> M[Model Status]
        E --> N[System Health]
    end
    
    subgraph "State Management"
        O[Redux Store]
        P[Authentication State]
        Q[Upload State]
        R[Results State]
    end
    
    subgraph "Services"
        S[API Service]
        T[WebSocket Service]
        U[File Service]
        V[Analytics Service]
    end
    
    F --> O
    G --> P
    H --> Q
    I --> R
    O --> S
    P --> T
    Q --> U
    R --> V
```

### 2. Backend Architecture

```mermaid
graph TB
    subgraph "API Layer"
        A[Flask Routes] --> B[Authentication Middleware]
        B --> C[Request Validation]
        C --> D[Rate Limiting]
        D --> E[Business Logic]
    end
    
    subgraph "Service Layer"
        F[File Upload Service]
        G[Analysis Service] 
        H[Model Service]
        I[Notification Service]
        J[User Service]
    end
    
    subgraph "Data Access Layer"
        K[Database ORM]
        L[Cache Manager]
        M[File Manager]
        N[Model Repository]
    end
    
    subgraph "External Services"
        O[Cloud Storage]
        P[Monitoring Service]
        Q[Email Service]
        R[SMS Service]
    end
    
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    
    F --> K
    G --> L
    H --> M
    I --> N
    
    K --> O
    L --> P
    M --> Q
    N --> R
```

### 3. AI/ML Pipeline Architecture

```mermaid
graph LR
    subgraph "Input Processing"
        A[Media Upload] --> B[File Validation]
        B --> C[Format Detection]
        C --> D[Preprocessing]
    end
    
    subgraph "Feature Extraction"
        D --> E[Image Features]
        D --> F[Video Features] 
        D --> G[Audio Features]
        
        E --> H[CNN Features]
        E --> I[Facial Features]
        E --> J[Texture Features]
        
        F --> K[Temporal Features]
        F --> L[Motion Features]
        F --> M[Frame Features]
        
        G --> N[Spectral Features]
        G --> O[Mel Features]
        G --> P[Voice Features]
    end
    
    subgraph "Model Inference"
        H --> Q[Image Classifier]
        I --> R[Face Detector]
        J --> S[Manipulation Detector]
        
        K --> T[Video Classifier]
        L --> U[Temporal Analyzer]
        M --> V[Consistency Checker]
        
        N --> W[Audio Classifier]
        O --> X[Voice Analyzer]
        P --> Y[Synthesis Detector]
    end
    
    subgraph "Result Fusion"
        Q --> Z[Ensemble Model]
        R --> Z
        S --> Z
        T --> Z
        U --> Z
        V --> Z
        W --> Z
        X --> Z
        Y --> Z
        
        Z --> AA[Final Prediction]
        Z --> AB[Confidence Score]
        Z --> AC[Evidence Report]
    end
```

## 🗄️ Database Schema

### Core Tables

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user'
);

-- Analysis Jobs Table
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Analysis Results Table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES analysis_jobs(id),
    prediction VARCHAR(20) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    is_authentic BOOLEAN NOT NULL,
    models_used TEXT[],
    processing_time DECIMAL(8,2),
    features_detected JSONB,
    evidence_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model Performance Table
CREATE TABLE model_performance (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataset_name VARCHAR(100)
);

-- System Logs Table
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    module VARCHAR(100),
    function_name VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);
```

### Indexes for Performance

```sql
-- Performance Indexes
CREATE INDEX idx_analysis_jobs_user_id ON analysis_jobs(user_id);
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX idx_analysis_jobs_created_at ON analysis_jobs(created_at);
CREATE INDEX idx_analysis_results_job_id ON analysis_results(job_id);
CREATE INDEX idx_analysis_results_prediction ON analysis_results(prediction);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_level ON system_logs(level);

-- Composite Indexes
CREATE INDEX idx_jobs_user_status ON analysis_jobs(user_id, status);
CREATE INDEX idx_results_prediction_confidence ON analysis_results(prediction, confidence);
```

## 🔄 Data Flow Architecture

### 1. File Upload Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Upload Service
    participant V as Validator
    participant D as Database
    participant Q as Queue
    
    U->>F: Select File
    F->>F: Client Validation
    F->>A: Upload Request
    A->>S: Forward Request
    S->>V: Validate File
    V->>S: Validation Result
    S->>D: Save Job Record
    S->>Q: Queue Analysis
    S->>A: Return Job ID
    A->>F: Success Response
    F->>U: Show Progress
```

### 2. Analysis Processing Flow

```mermaid
sequenceDiagram
    participant Q as Queue
    participant W as Worker
    participant P as Preprocessor
    participant M as ML Engine
    participant D as Database
    participant N as Notification
    
    Q->>W: Dequeue Job
    W->>P: Preprocess File
    P->>M: Extract Features
    M->>M: Run Inference
    M->>W: Return Results
    W->>D: Save Results
    W->>N: Send Notification
    W->>Q: Mark Complete
```

### 3. Real-time Updates Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant W as WebSocket
    participant S as Server
    participant R as Redis
    participant D as Database
    
    F->>W: Connect WebSocket
    W->>S: Establish Connection
    S->>R: Subscribe to Updates
    
    loop Analysis Progress
        S->>R: Publish Progress
        R->>S: Notify Subscribers
        S->>W: Send Update
        W->>F: Update UI
    end
    
    S->>D: Fetch Final Results
    D->>S: Return Results
    S->>W: Send Complete
    W->>F: Show Results
```

## ⚡ Performance Optimization

### 1. Caching Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        A[Browser Cache] --> B[CDN Cache]
        B --> C[API Gateway Cache]
        C --> D[Application Cache]
        D --> E[Database Cache]
    end
    
    subgraph "Cache Types"
        F[Static Assets] --> A
        G[API Responses] --> C
        H[Query Results] --> D
        I[Model Outputs] --> E
    end
    
    subgraph "Cache Invalidation"
        J[Time-based TTL]
        K[Event-based Invalidation]
        L[Manual Purge]
    end
    
    F --> J
    G --> K
    H --> L
```

### 2. Scaling Strategy

```mermaid
graph LR
    subgraph "Horizontal Scaling"
        A[Load Balancer] --> B[App Instance 1]
        A --> C[App Instance 2]
        A --> D[App Instance N]
    end
    
    subgraph "Vertical Scaling"
        E[CPU Scaling]
        F[Memory Scaling]
        G[GPU Scaling]
    end
    
    subgraph "Auto Scaling"
        H[Metrics Collection]
        I[Threshold Monitoring]
        J[Scale Decisions]
        K[Instance Management]
    end
    
    B --> E
    C --> F
    D --> G
    
    E --> H
    F --> I
    G --> J
    J --> K
```

## 🔒 Security Architecture

### 1. Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        A[WAF] --> B[DDoS Protection]
        B --> C[SSL/TLS Termination]
        C --> D[Network Policies]
    end
    
    subgraph "Application Security"
        E[Authentication] --> F[Authorization]
        F --> G[Input Validation]
        G --> H[Output Encoding]
    end
    
    subgraph "Data Security"
        I[Encryption at Rest] --> J[Encryption in Transit]
        J --> K[Key Management]
        K --> L[Access Controls]
    end
    
    subgraph "Infrastructure Security"
        M[Container Security] --> N[Secret Management]
        N --> O[Vulnerability Scanning]
        O --> P[Compliance Monitoring]
    end
    
    A --> E
    E --> I
    I --> M
```

### 2. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant D as Database
    participant T as Token Service
    
    U->>F: Login Request
    F->>A: Submit Credentials
    A->>D: Validate User
    D->>A: User Details
    A->>T: Generate Tokens
    T->>A: JWT + Refresh Token
    A->>F: Return Tokens
    F->>F: Store Tokens
    F->>U: Login Success
    
    Note over U,T: Subsequent Requests
    U->>F: API Request
    F->>A: Include JWT
    A->>T: Validate Token
    T->>A: Token Valid
    A->>F: Process Request
```

## 🚀 Deployment Architecture

### 1. Container Architecture

```dockerfile
# Multi-stage build example
FROM python:3.9-slim as base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base as development
COPY . .
ENV FLASK_ENV=development
CMD ["python", "app.py"]

FROM base as production
COPY . .
ENV FLASK_ENV=production
RUN adduser --disabled-password --gecos '' appuser
USER appuser
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### 2. Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deepfake-detector
spec:
  replicas: 3
  selector:
    matchLabels:
      app: deepfake-detector
  template:
    metadata:
      labels:
        app: deepfake-detector
    spec:
      containers:
      - name: app
        image: deepfake-detector:latest
        ports:
        - containerPort: 5000
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
---
apiVersion: v1
kind: Service
metadata:
  name: deepfake-detector-service
spec:
  selector:
    app: deepfake-detector
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
  type: LoadBalancer
```

## 📊 Monitoring & Observability

### 1. Metrics Collection

```mermaid
graph LR
    subgraph "Application Metrics"
        A[Request Rate]
        B[Response Time]
        C[Error Rate]
        D[Throughput]
    end
    
    subgraph "Business Metrics"
        E[Analysis Count]
        F[Accuracy Rate]
        G[User Activity]
        H[Model Performance]
    end
    
    subgraph "Infrastructure Metrics"
        I[CPU Usage]
        J[Memory Usage]
        K[Disk I/O]
        L[Network I/O]
    end
    
    subgraph "Collection Systems"
        M[Prometheus]
        N[Grafana]
        O[ELK Stack]
        P[Custom Dashboards]
    end
    
    A --> M
    E --> N
    I --> O
    M --> P
```

### 2. Logging Architecture

```mermaid
graph TB
    subgraph "Log Sources"
        A[Application Logs]
        B[Access Logs]
        C[Error Logs]
        D[Audit Logs]
    end
    
    subgraph "Log Processing"
        E[Log Aggregation]
        F[Log Parsing]
        G[Log Enrichment]
        H[Log Filtering]
    end
    
    subgraph "Log Storage"
        I[Elasticsearch]
        J[S3 Archive]
        K[Database Logs]
    end
    
    subgraph "Log Analysis"
        L[Kibana Dashboards]
        M[Alert Manager]
        N[Log Analytics]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> I
    I --> L
    J --> M
    K --> N
```

## 🏗️ Complete Infrastructure Architecture

### Kubernetes Deployment Architecture

```mermaid
graph TB
    %% Kubernetes Cluster
    subgraph "☸️ Kubernetes Cluster"
        subgraph "🌐 Ingress Layer"
            INGRESS["🚪 Ingress Controller<br/>NGINX/Traefik"]
            TLS["🔒 TLS Termination<br/>cert-manager"]
        end
        
        subgraph "🏢 Application Namespace"
            subgraph "🚪 Gateway Services"
                GATEWAY_POD["🚪 API Gateway<br/>Deployment: 3 replicas"]
                AUTH_POD["🔐 Auth Service<br/>Deployment: 2 replicas"]
            end
            
            subgraph "⚙️ Core Services"
                UPLOAD_POD["📤 Upload Service<br/>Deployment: 3 replicas"]
                ANALYSIS_POD["🔍 Analysis Service<br/>Deployment: 5 replicas"]
                NOTIFY_POD["📢 Notification Service<br/>Deployment: 2 replicas"]
            end
            
            subgraph "🧠 ML Services"
                ML_POD["🤖 ML Inference<br/>StatefulSet: 3 replicas<br/>GPU Nodes"]
                PREPROCESS_POD["🔧 Preprocessor<br/>Deployment: 4 replicas"]
            end
            
            subgraph "📬 Queue Services"
                WORKER_POD["⚙️ Worker Nodes<br/>Deployment: 10 replicas<br/>CPU Intensive"]
                SCHEDULER_POD["⏰ Scheduler<br/>CronJob"]
            end
        end
        
        subgraph "🗄️ Data Namespace"
            POSTGRES_STS["🐘 PostgreSQL<br/>StatefulSet<br/>Persistent Storage"]
            REDIS_STS["🔴 Redis Cluster<br/>StatefulSet: 6 replicas<br/>Master-Slave"]
        end
        
        subgraph "📊 Monitoring Namespace"
            PROMETHEUS["📈 Prometheus<br/>StatefulSet"]
            GRAFANA["📊 Grafana<br/>Deployment"]
            JAEGER["🔍 Jaeger<br/>DaemonSet"]
            ELASTIC["🔍 Elasticsearch<br/>StatefulSet: 3 replicas"]
        end
        
        subgraph "📋 ConfigMaps & Secrets"
            CONFIG["⚙️ ConfigMaps<br/>App Configuration"]
            SECRETS["🔐 Secrets<br/>API Keys, Passwords"]
            PV["💾 Persistent Volumes<br/>Storage Classes"]
        end
    end
    
    %% External Services
    subgraph "🌐 External Services"
        S3["☁️ AWS S3<br/>Object Storage"]
        EMAIL_SVC["📧 Email Service<br/>SendGrid"]
        SMS_SVC["📱 SMS Service<br/>Twilio"]
        MONITORING["📊 External Monitoring<br/>DataDog"]
    end
    
    %% Load Balancer
    LB["⚖️ Cloud Load Balancer<br/>AWS ALB/GCP LB"]
    
    %% Connections
    LB --> INGRESS
    INGRESS --> TLS
    TLS --> GATEWAY_POD
    
    GATEWAY_POD --> AUTH_POD
    GATEWAY_POD --> UPLOAD_POD
    GATEWAY_POD --> ANALYSIS_POD
    GATEWAY_POD --> NOTIFY_POD
    
    ANALYSIS_POD --> ML_POD
    ANALYSIS_POD --> PREPROCESS_POD
    ANALYSIS_POD --> WORKER_POD
    
    UPLOAD_POD --> POSTGRES_STS
    ANALYSIS_POD --> REDIS_STS
    AUTH_POD --> POSTGRES_STS
    
    ML_POD --> S3
    NOTIFY_POD --> EMAIL_SVC
    NOTIFY_POD --> SMS_SVC
    
    %% Monitoring Connections
    GATEWAY_POD -.-> PROMETHEUS
    ANALYSIS_POD -.-> ELASTIC
    ML_POD -.-> JAEGER
    PROMETHEUS --> GRAFANA
    GRAFANA --> MONITORING
    
    %% Configuration
    GATEWAY_POD -.-> CONFIG
    AUTH_POD -.-> SECRETS
    POSTGRES_STS -.-> PV
    
    %% Styling
    classDef k8sStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef serviceStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef dataStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef monitorStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef configStyle fill:#fff8e1,stroke:#fbc02d,stroke-width:2px
    classDef externalStyle fill:#fafafa,stroke:#616161,stroke-width:2px
    
    class INGRESS,TLS k8sStyle
    class GATEWAY_POD,AUTH_POD,UPLOAD_POD,ANALYSIS_POD,NOTIFY_POD,ML_POD,PREPROCESS_POD,WORKER_POD,SCHEDULER_POD serviceStyle
    class POSTGRES_STS,REDIS_STS dataStyle
    class PROMETHEUS,GRAFANA,JAEGER,ELASTIC monitorStyle
    class CONFIG,SECRETS,PV configStyle
    class S3,EMAIL_SVC,SMS_SVC,MONITORING,LB externalStyle
```

### Microservices Communication Architecture

```mermaid
graph TB
    %% Client Layer
    subgraph "📱 Client Applications"
        WEB_APP["🌐 Web Application<br/>React SPA"]
        MOBILE_APP["📱 Mobile App<br/>React Native"]
        CLI_APP["💻 CLI Tool<br/>Python"]
    end
    
    %% API Gateway
    subgraph "🚪 API Gateway"
        GATEWAY["🚪 Gateway Service<br/>Kong/Ambassador"]
        subgraph "🔐 Security Layer"
            AUTH_SVC["🔐 Authentication<br/>OAuth2/JWT"]
            AUTHZ_SVC["🔒 Authorization<br/>RBAC/ABAC"]
            RATE_SVC["🚦 Rate Limiting<br/>Redis-based"]
        end
    end
    
    %% Core Business Services
    subgraph "🏢 Core Services"
        USER_SVC["👤 User Service<br/>Profile Management"]
        FILE_SVC["📁 File Service<br/>Upload/Storage"]
        JOB_SVC["📋 Job Service<br/>Analysis Management"]
        RESULT_SVC["📊 Result Service<br/>Output Management"]
    end
    
    %% AI/ML Services
    subgraph "🧠 AI/ML Services"
        PREPROC_SVC["🔧 Preprocessing<br/>Media Normalization"]
        
        subgraph "🎯 Detection Services"
            IMG_SVC["🖼️ Image Detection<br/>CNN Models"]
            VID_SVC["🎬 Video Detection<br/>Temporal Models"]
            AUD_SVC["🔊 Audio Detection<br/>Spectral Models"]
        end
        
        ENSEMBLE_SVC["🎭 Ensemble Service<br/>Model Fusion"]
        MODEL_SVC["🤖 Model Management<br/>Version Control"]
    end
    
    %% Support Services
    subgraph "🛠️ Support Services"
        NOTIFY_SVC["📢 Notification<br/>Email/SMS/WebSocket"]
        REPORT_SVC["📊 Reporting<br/>Analytics/Export"]
        AUDIT_SVC["📝 Audit Service<br/>Compliance Logging"]
        HEALTH_SVC["❤️ Health Check<br/>Service Monitoring"]
    end
    
    %% Message Queue
    subgraph "📬 Message Queue"
        QUEUE["📨 Message Broker<br/>RabbitMQ/Kafka"]
        subgraph "⚙️ Queue Topics"
            UPLOAD_Q["📤 Upload Queue"]
            ANALYSIS_Q["🔍 Analysis Queue"]
            RESULT_Q["📊 Result Queue"]
            NOTIFY_Q["📢 Notification Queue"]
        end
    end
    
    %% Data Services
    subgraph "🗄️ Data Services"
        DB_SVC["🐘 Database Service<br/>PostgreSQL"]
        CACHE_SVC["⚡ Cache Service<br/>Redis Cluster"]
        STORAGE_SVC["💾 Storage Service<br/>S3/MinIO"]
        SEARCH_SVC["🔍 Search Service<br/>Elasticsearch"]
    end
    
    %% Communication Patterns
    
    %% Client to Gateway
    WEB_APP --> GATEWAY
    MOBILE_APP --> GATEWAY
    CLI_APP --> GATEWAY
    
    %% Gateway Security Flow
    GATEWAY --> AUTH_SVC
    AUTH_SVC --> AUTHZ_SVC
    AUTHZ_SVC --> RATE_SVC
    
    %% Gateway to Core Services
    GATEWAY --> USER_SVC
    GATEWAY --> FILE_SVC
    GATEWAY --> JOB_SVC
    GATEWAY --> RESULT_SVC
    
    %% Core Services to Queue
    FILE_SVC --> UPLOAD_Q
    JOB_SVC --> ANALYSIS_Q
    RESULT_SVC --> RESULT_Q
    
    %% Queue to AI Services
    UPLOAD_Q --> PREPROC_SVC
    ANALYSIS_Q --> IMG_SVC
    ANALYSIS_Q --> VID_SVC
    ANALYSIS_Q --> AUD_SVC
    
    %% AI Services Flow
    PREPROC_SVC --> IMG_SVC
    PREPROC_SVC --> VID_SVC
    PREPROC_SVC --> AUD_SVC
    IMG_SVC --> ENSEMBLE_SVC
    VID_SVC --> ENSEMBLE_SVC
    AUD_SVC --> ENSEMBLE_SVC
    
    %% Results Flow
    ENSEMBLE_SVC --> RESULT_Q
    RESULT_Q --> RESULT_SVC
    RESULT_SVC --> NOTIFY_Q
    NOTIFY_Q --> NOTIFY_SVC
    
    %% Support Services
    RESULT_SVC --> REPORT_SVC
    USER_SVC --> AUDIT_SVC
    GATEWAY --> HEALTH_SVC
    
    %% Data Access
    USER_SVC <--> DB_SVC
    FILE_SVC <--> STORAGE_SVC
    JOB_SVC <--> DB_SVC
    RESULT_SVC <--> DB_SVC
    
    %% Caching
    USER_SVC <--> CACHE_SVC
    RESULT_SVC <--> CACHE_SVC
    ENSEMBLE_SVC <--> CACHE_SVC
    
    %% Search
    RESULT_SVC <--> SEARCH_SVC
    AUDIT_SVC <--> SEARCH_SVC
    
    %% Model Management
    IMG_SVC <--> MODEL_SVC
    VID_SVC <--> MODEL_SVC
    AUD_SVC <--> MODEL_SVC
    MODEL_SVC <--> STORAGE_SVC
    
    %% Styling
    classDef clientStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef gatewayStyle fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef coreStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef aiStyle fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    classDef supportStyle fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef queueStyle fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef dataStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    
    class WEB_APP,MOBILE_APP,CLI_APP clientStyle
    class GATEWAY,AUTH_SVC,AUTHZ_SVC,RATE_SVC gatewayStyle
    class USER_SVC,FILE_SVC,JOB_SVC,RESULT_SVC coreStyle
    class PREPROC_SVC,IMG_SVC,VID_SVC,AUD_SVC,ENSEMBLE_SVC,MODEL_SVC aiStyle
    class NOTIFY_SVC,REPORT_SVC,AUDIT_SVC,HEALTH_SVC supportStyle
    class QUEUE,UPLOAD_Q,ANALYSIS_Q,RESULT_Q,NOTIFY_Q queueStyle
    class DB_SVC,CACHE_SVC,STORAGE_SVC,SEARCH_SVC dataStyle
```

## 🎯 API Design Patterns

### RESTful API Architecture

```mermaid
graph LR
    subgraph "🌐 API Endpoints"
        subgraph "🔐 Authentication"
            AUTH_LOGIN["/auth/login<br/>POST"]
            AUTH_REFRESH["/auth/refresh<br/>POST"]
            AUTH_LOGOUT["/auth/logout<br/>POST"]
        end
        
        subgraph "👤 User Management"
            USER_PROFILE["/users/profile<br/>GET/PUT"]
            USER_SETTINGS["/users/settings<br/>GET/PATCH"]
        end
        
        subgraph "📁 File Operations"
            FILE_UPLOAD["/files/upload<br/>POST"]
            FILE_STATUS["/files/{id}/status<br/>GET"]
            FILE_DOWNLOAD["/files/{id}/download<br/>GET"]
        end
        
        subgraph "🔍 Analysis Operations"
            ANALYSIS_CREATE["/analysis<br/>POST"]
            ANALYSIS_STATUS["/analysis/{id}<br/>GET"]
            ANALYSIS_RESULTS["/analysis/{id}/results<br/>GET"]
            ANALYSIS_LIST["/analysis<br/>GET"]
        end
        
        subgraph "📊 Results & Reports"
            RESULTS_EXPORT["/results/{id}/export<br/>GET"]
            REPORTS_GENERATE["/reports<br/>POST"]
            ANALYTICS["/analytics<br/>GET"]
        end
        
        subgraph "🤖 Model Management"
            MODELS_LIST["/models<br/>GET"]
            MODELS_STATUS["/models/{id}/status<br/>GET"]
            MODELS_METRICS["/models/{id}/metrics<br/>GET"]
        end
        
        subgraph "🔌 Real-time"
            WEBSOCKET["/ws/analysis/{id}<br/>WebSocket"]
            SSE["/sse/progress/{id}<br/>Server-Sent Events"]
        end
    end
    
    subgraph "📡 API Gateway Features"
        VERSIONING["📋 API Versioning<br/>v1, v2"]
        RATE_LIMITING["🚦 Rate Limiting<br/>Per User/IP"]
        CACHING["⚡ Response Caching<br/>Redis-based"]
        VALIDATION["✅ Request Validation<br/>JSON Schema"]
        CORS["🌐 CORS Handling<br/>Cross-origin"]
        COMPRESSION["🗜️ Response Compression<br/>gzip/brotli"]
    end
    
    %% API Features
    AUTH_LOGIN --> VERSIONING
    FILE_UPLOAD --> RATE_LIMITING
    ANALYSIS_STATUS --> CACHING
    ANALYSIS_CREATE --> VALIDATION
    WEBSOCKET --> CORS
    RESULTS_EXPORT --> COMPRESSION
```

### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: DeepFake Detection API
  version: 2.0.0
  description: |
    Advanced AI-powered deepfake detection service with multi-modal analysis capabilities.
    
    ## Features
    - Multi-format support (images, videos, audio)
    - Real-time processing with WebSocket updates
    - Ensemble model predictions with confidence scores
    - Comprehensive audit logging and analytics
    
  contact:
    name: API Support
    email: api-support@deepfakedetection.com
    url: https://docs.deepfakedetection.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.deepfakedetection.com/v2
    description: Production server
  - url: https://staging-api.deepfakedetection.com/v2
    description: Staging server

security:
  - BearerAuth: []
  - ApiKeyAuth: []

paths:
  /analysis:
    post:
      summary: Create new analysis job
      description: |
        Submit a media file for deepfake analysis. Supports images, videos, and audio files.
        Returns a job ID for tracking progress and retrieving results.
      tags:
        - Analysis
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
              properties:
                file:
                  type: string
                  format: binary
                  description: Media file to analyze (max 100MB)
                options:
                  $ref: '#/components/schemas/AnalysisOptions'
                metadata:
                  type: object
                  description: Additional metadata for the analysis
                  properties:
                    source:
                      type: string
                      description: Source of the media file
                    tags:
                      type: array
                      items:
                        type: string
                      description: Tags for categorization
      responses:
        '201':
          description: Analysis job created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalysisJob'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '413':
          $ref: '#/components/responses/PayloadTooLarge'
        '429':
          $ref: '#/components/responses/TooManyRequests'
    
    get:
      summary: List analysis jobs
      description: Retrieve a paginated list of analysis jobs for the authenticated user
      tags:
        - Analysis
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
        - name: status
          in: query
          schema:
            $ref: '#/components/schemas/JobStatus'
        - name: sort
          in: query
          schema:
            type: string
            enum: [created_at, updated_at, confidence]
            default: created_at
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: List of analysis jobs
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/AnalysisJob'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

  /analysis/{jobId}:
    get:
      summary: Get analysis job details
      description: Retrieve detailed information about a specific analysis job
      tags:
        - Analysis
      parameters:
        - name: jobId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Analysis job details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalysisJobDetail'
        '404':
          $ref: '#/components/responses/NotFound'

  /analysis/{jobId}/results:
    get:
      summary: Get analysis results
      description: Retrieve the results of a completed analysis job
      tags:
        - Analysis
      parameters:
        - name: jobId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: format
          in: query
          schema:
            type: string
            enum: [json, pdf, csv]
            default: json
      responses:
        '200':
          description: Analysis results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalysisResult'
            application/pdf:
              schema:
                type: string
                format: binary
            text/csv:
              schema:
                type: string

components:
  schemas:
    AnalysisOptions:
      type: object
      properties:
        models:
          type: array
          items:
            type: string
            enum: [cnn_v2, temporal_v1, audio_v3, ensemble]
          description: Specific models to use for analysis
        detailed_analysis:
          type: boolean
          default: false
          description: Enable detailed feature analysis
        face_detection:
          type: boolean
          default: true
          description: Enable facial region detection
        confidence_threshold:
          type: number
          minimum: 0.0
          maximum: 1.0
          default: 0.5
          description: Minimum confidence threshold for predictions
        priority:
          type: string
          enum: [low, normal, high, urgent]
          default: normal
          description: Processing priority
    
    AnalysisJob:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique job identifier
        user_id:
          type: string
          description: User who created the job
        filename:
          type: string
          description: Original filename
        file_type:
          type: string
          enum: [image, video, audio]
        file_size:
          type: integer
          description: File size in bytes
        status:
          $ref: '#/components/schemas/JobStatus'
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        estimated_completion:
          type: string
          format: date-time
          nullable: true
        progress:
          type: integer
          minimum: 0
          maximum: 100
          description: Processing progress percentage
    
    JobStatus:
      type: string
      enum:
        - pending
        - queued
        - processing
        - completed
        - failed
        - cancelled
    
    AnalysisResult:
      type: object
      properties:
        job_id:
          type: string
          format: uuid
        prediction:
          type: string
          enum: [authentic, deepfake, unknown]
        confidence:
          type: number
          minimum: 0.0
          maximum: 1.0
          description: Overall confidence score
        is_authentic:
          type: boolean
          description: Binary authenticity prediction
        models_used:
          type: array
          items:
            type: string
          description: List of models used in analysis
        processing_time:
          type: number
          description: Processing time in seconds
        evidence:
          type: object
          description: Detailed evidence and explanations
          properties:
            facial_inconsistencies:
              type: number
              minimum: 0.0
              maximum: 1.0
            temporal_artifacts:
              type: number
              minimum: 0.0
              maximum: 1.0
            compression_anomalies:
              type: number
              minimum: 0.0
              maximum: 1.0
            feature_maps:
              type: array
              items:
                type: object
                properties:
                  layer:
                    type: string
                  activation_map:
                    type: string
                    format: base64
        metadata:
          type: object
          description: File and analysis metadata
        created_at:
          type: string
          format: date-time
  
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
  
  responses:
    BadRequest:
      description: Bad request - invalid parameters
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
              details:
                type: array
                items:
                  type: string
    
    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                default: "Authentication required"
    
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                default: "Resource not found"
    
    PayloadTooLarge:
      description: File too large
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                default: "File size exceeds maximum limit"
    
    TooManyRequests:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                default: "Rate limit exceeded"
              retry_after:
                type: integer
                description: Seconds to wait before retrying
```

