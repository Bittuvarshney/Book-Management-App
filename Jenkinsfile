pipeline{
    agent any

    environment {
        VercelToken = credentials('vercel_token')
    }
    stages {
        stage('Install') {
            steps {
                bat 'npm install'
            } 
        }
         stage('test') {
            steps {
                echo 'test'
            }
        }
         stage('buildt') {
            steps {
               bat 'npm run build'
            }
    }
         stage('deploy') {
            steps {
                bat 'npx vercel --prod --yes --token=%VercelToken%'
            }
    }
    }
}
