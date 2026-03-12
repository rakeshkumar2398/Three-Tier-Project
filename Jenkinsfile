// url: 'https://github.com/your-username/your-repo.git'
// DOCKERHUB_REPO = "yourdockerhubusername/chai-kafe-app"
// DOCKERHUB_CREDENTIALS = "dockerhub-creds"

pipeline {
    agent any

    environment {
        APP_NAME = "chai-kafe-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKERHUB_CREDENTIALS = "dockerhub-creds"
        DOCKERHUB_REPO = "yourdockerhubusername/chai-kafe-app"
    }

    tools {
        maven 'Maven'
        jdk 'JDK17'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Build JAR') {
            steps {
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_REPO:$IMAGE_TAG .'
                sh 'docker tag $DOCKERHUB_REPO:$IMAGE_TAG $DOCKERHUB_REPO:latest'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh 'trivy image $DOCKERHUB_REPO:$IMAGE_TAG || true'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $DOCKERHUB_REPO:$IMAGE_TAG'
                sh 'docker push $DOCKERHUB_REPO:latest'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}