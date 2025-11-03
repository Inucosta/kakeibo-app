# Nodeの公式イメージ
FROM node:20

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリ本体をコピー
COPY . .

EXPOSE 3000

# Reactの開発サーバ起動
CMD ["npm", "start"]
