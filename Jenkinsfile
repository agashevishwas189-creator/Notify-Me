pipeline {
  agent any

  environment {
    SONAR_PROJECT = 'notify-me'
    DH = credentials('docker-id')
  }

  stages {
    stage('1. Checkout') {
      steps { checkout scm }
    }

    stage('2. Build (npm)') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('3. SonarQube Scan') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh '''
            docker run --rm --network host -u "$(id -u):$(id -g)" \
              -e SONAR_HOST_URL=http://localhost:9000 \
              -e SONAR_TOKEN=$SONAR_TOKEN \
              -e SONAR_USER_HOME=/tmp/.sonar \
              -v "$WORKSPACE/backend":/usr/src \
              sonarsource/sonar-scanner-cli \
              -Dsonar.projectKey=$SONAR_PROJECT \
              -Dsonar.sources=. \
              -Dsonar.exclusions=node_modules/**,global-bundle.pem
          '''
        }
      }
    }

    stage('4. Docker Build') {
      steps {
        sh 'docker build -t $DH_USR/notify-me:$BUILD_NUMBER -t $DH_USR/notify-me:latest backend'
      }
    }

    stage('5. Trivy Scan') {
      steps {
        sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 $DH_USR/notify-me:$BUILD_NUMBER'
      }
    }

    stage('6. Push to Docker Hub') {
      steps {
        sh '''
          echo $DH_PSW | docker login -u $DH_USR --password-stdin
          docker push $DH_USR/notify-me:$BUILD_NUMBER
          docker push $DH_USR/notify-me:latest
        '''
      }
    }
  }

  post {
    always { sh 'docker logout || true' }
  }
}
