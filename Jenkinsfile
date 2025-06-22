pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone from GitHub (using shell)') {
            steps {
                sh 'git clone https://github.com/HasanMal1k/Rinxo.git'
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                dir('Rinxo') {
                    sh 'docker compose -p thereactapp up -d --build'
                }
            }
        }
    }
}
