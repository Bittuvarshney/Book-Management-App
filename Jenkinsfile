pipeline {
    agent any

    environment {
        VercelToken = credentials('vercel_token')
    }

    stages {

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('front-end') {
                    bat 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing completed'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('front-end') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy to Vercel') {
    steps {
        dir('front-end') {
            withCredentials([string(credentialsId: 'vercel_token', variable: 'VERCEL_TOKEN')]) {
                bat 'npx vercel --prod --yes --token=%VERCEL_TOKEN%'
            }
        }
    }
}
    }
}