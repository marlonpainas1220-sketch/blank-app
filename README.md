# 🤖 AI Influencer Platform - Mobile Dashboard

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Mobile_Web-blue)
![License](https://img.shields.io/badge/License-Free-orange)

Uma plataforma Web simplificada para criação de influenciadores digitais utilizando Inteligência Artificial de ponta. Este dashboard conecta você aos melhores motores de IA open-source para gerar fotos, vídeos (Reels) e clonagem de voz diretamente pelo celular, sem custo de processamento local.

---

## 🚀 Funcionalidades Principais

* **Identidade Fixa (FaceID):** Mantém a fisionomia da sua influencer idêntica em todas as gerações.
* **Animação de Vídeo (LivePortrait):** Transfere movimentos faciais de um vídeo de referência para uma foto estática.
* **Clonagem de Voz (GPT-SoVITS):** Cria áudios personalizados baseados em amostras de voz reais.
* **Interface Mobile-First:** Design otimizado para uso em smartphones como um WebApp (PWA).

---

## 🛠️ Ferramentas Integradas

Este projeto utiliza os "Spaces" do Hugging Face para processamento em nuvem gratuito:

1.  **Geração de Reels:** [Kwai-VGI / LivePortrait](https://huggingface.co/spaces/Kwai-VGI/LivePortrait)
2.  **Consistência Facial:** [InstantID / InstantID](https://huggingface.co/spaces/InstantID/InstantID)
3.  **Motor de Voz:** [RVC-Boss / GPT-SoVITS](https://huggingface.co/spaces/RVC-Boss/GPT-SoVITS)

---

## 📲 Como Instalar no Telefone

1.  Acesse o link gerado pelo **GitHub Pages**.
2.  No iPhone (Safari): Clique no botão de **Compartilhar** e selecione **"Adicionar à Tela de Início"**.
3.  No Android (Chrome): Clique nos três pontos e selecione **"Instalar Aplicativo"** ou **"Adicionar à Tela Inicial"**.

---

## 📖 Passo a Passo de Produção

### 1. Criando a Identidade
Use o módulo **InstantID** para carregar uma foto de referência. A IA criará novas fotos em diferentes cenários mantendo o mesmo rosto.

### 2. Animando para Reels
No módulo **LivePortrait**, suba a foto gerada no passo anterior. Use um vídeo seu (ou de banco de vídeos) fazendo as expressões desejadas. A IA fundirá os dois.

### 3. Clonando a Voz
Suba um áudio de referência no módulo de **Voz**. Digite o texto que sua influencer deve dizer e faça o download do arquivo `.mp3`.

### 4. Finalização
Utilize editores como **CapCut** ou **InShot** para sincronizar o áudio gerado com o vídeo animado.

---

## ⚖️ Licença e Uso
Este projeto é para fins educacionais e de criação de conteúdo. Certifique-se de seguir as políticas éticas de uso de IA e não criar deepfakes de pessoas reais sem consentimento.

---
Desenvolvido por [Seu Nome/Username]
