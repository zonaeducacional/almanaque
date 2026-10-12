# Cyber Almanaque

> *"Tudo que é sólido desmancha no ar."*

O **Cyber Almanaque** é um almanaque do século XXI em formato de Progressive Web App (PWA), construído com React, Vite, TypeScript e Tailwind CSS. É uma aplicação de espírito solarpunk, humanista e com vocação comunitária, concebida sob o princípio radical do **anti-feed**.

---

## 1. O que é o Cyber Almanaque

Diferente das redes sociais e aplicativos desenhados para extrair atenção:
* **Anti-feed & Finito**: Cada dia possui uma página estritamente finita. Não existe rolagem infinita, feed algorítmico, notificações push intrusivas, contadores de ofensiva (streaks) nem rastreamento de dados. Ao terminar a leitura, o rodapé lembra: *"Você leu tudo por hoje. Vá viver."*
* **100% Offline & Local-First**: Todo o conteúdo editorial e dados do usuário (notas de margem, saberes e problemas locais) ficam salvos no aparelho via IndexedDB (com fallback automático para localStorage). Nenhum dado pessoal é transmitido para servidores remotos.
* **Estética Solarpunk**: Paleta calorosa em verdes de folhagem, ocres terrosos e azul-céu suave; tipografia serifada generosa e legível (Lora), contrastes validados (WCAG AA), e ilustrações vetoriais limpas.
* **Cálculos Astronômicos Locais**: Fases da lua (algoritmo trigonométrico de Conway/Meeus) e horários do nascer e pôr do sol calculados diretamente no navegador em JavaScript puro, sem dependências de APIs externas.

---

## 2. Como Rodar Localmente

### Pré-requisitos
* Node.js versão 18 ou superior
* npm

### Passo a passo
1. Clone ou baixe o repositório.
2. No diretório raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra o navegador em: `http://localhost:3000` (ou a porta informada pelo Vite).

---

## 3. Como Publicar (Build de Produção)

Para gerar os arquivos estáticos otimizados para produção:
```bash
npm run build
```
Os arquivos finais serão gerados na pasta `/dist`.

### Onde hospedar
A pasta `/dist` pode ser servida em qualquer hospedagem estática, tais como:
* **Cloudflare Pages**: `wrangler pages deploy dist`
* **Vercel**: `vercel deploy --prebuilt` ou apontar build para `npm run build` e output para `dist`
* **Netlify**: arraste a pasta `dist` ou configure o comando `npm run build`
* **GitHub Pages**: configure uma GitHub Action para servir a pasta `dist`
* **Servidor próprio Nginx/Apache**: aponte a raiz do servidor para a pasta `dist`. Certifique-se de configurar HTTPS para que o Service Worker e os recursos PWA funcionem plenamente.

---

## 4. Como Criar um Pacote de Conteúdo (Edições do Almanaque)

O Cyber Almanaque utiliza o sistema modular de **Edições e Pacotes JSON**. Você pode criar uma edição para o seu bairro, escola, associação comunitária ou coletivo cultural.

### Formato do arquivo JSON de Pacote
O arquivo deve conter as seguintes propriedades obrigatórias:

```json
{
  "id": "minha-cidade-2026",
  "nome": "Almanaque do Bairro da Paz • Edição Comunitária",
  "ano": 2026,
  "regiao": "Salvador, BA",
  "versao": "1.0",
  "autoria": "Coletivo Cultural do Bairro",
  "descricao": "Saberes locais, memórias e cuidados ecológicos.",
  "itens": [
    {
      "id": "dia-comunitario-01",
      "tipo": "dia",
      "titulo": "Dia da Mata Comunitária",
      "autor": "Dona Maria da Horta",
      "rotulo_ia": "100% humano",
      "dados": {
        "id": "dia-comunitario-01",
        "dataIso": "2026-03-21",
        "dataExtenso": "21 de março de 2026",
        "placarProgresso": {
          "numero": "1.200",
          "unidade": "mudas nativas plantadas",
          "descricao": "Mutirão de jovens recuperou a nascente da comunidade.",
          "fonte": "Boletim Comunitário Local"
        },
        "gestoDoDia": {
          "titulo": "Trocar uma muda com um vizinho",
          "acao": "Ofereça um galho de alecrim ou manjericão para quem mora ao lado.",
          "porQue": "A conversa sobre plantas abre caminhos de confiança."
        },
        "hojeNaCiencia": {
          "ano": 1928,
          "titulo": "Descoberta da Penicilina",
          "acontecimento": "Alexander Fleming percebe o mofo Penicillium inibindo bactérias.",
          "impacto": "Início da era dos antibióticos."
        },
        "leituraDoDia": {
          "titulo": "Cantiga da Terra Nova",
          "autor": "Poeta da Comunidade",
          "texto": "O chão que pisamos não é herança dos antepassados,\né empréstimo sagrado dos nossos filhos.",
          "dominioPublico": true,
          "notaEditorial": "Registro oral da comunidade."
        },
        "palavraOuProverbio": {
          "tipo": "proverbio",
          "termo": "Quem planta tâmara não colhe tâmara, mas deixa sombra.",
          "origem": "Sabedoria popular",
          "significado": "Trabalhar pelo futuro que talvez não vejamos com os próprios olhos."
        }
      }
    },
    {
      "id": "saber-local-01",
      "tipo": "saber",
      "titulo": "Chá de Guaco para o Peito Cheio",
      "autor": "Seu Antônio Benzedor",
      "rotulo_ia": "100% humano",
      "dados": {
        "tipo": "remedio_quintal",
        "quemEnsinou": "Minha avó Sebastiana",
        "geracao": "Avós / 2 gerações atrás",
        "texto": "Ferva 5 folhas de guaco limpas em meio litro de água por 5 minutos. Adoce com uma colher de mel de tiúba depois de amornar.",
        "aviso": "Lembrando: remédios de quintal confortam o sintoma, mas não substituem atendimento na Unidade Básica de Saúde."
      }
    }
  ]
}
```

### Como importar ou testar:
1. Acesse a aba **Edições** (pelo menu inferior ou no topo).
2. Clique em **"Importar Pacote (JSON)"** e selecione o seu arquivo. O app valida o formato e exibe mensagens de erro claras se algum campo estiver faltando.
3. Para testar rapidamente, você também pode usar o botão **"Testar com Edição de Exemplo"**, que carrega a edição embutida do Vale do Ribeira (`pacote-exemplo.json`).
4. É possível também clicar em **"Exportar Almanaque Comunitário"** para gerar um pacote JSON a partir dos saberes e ideias registrados localmente pelo usuário.

---

## 5. Como Adicionar uma Nova Cidade

Os horários do nascer e pôr do sol e a latitude/longitude são configurados no arquivo:
`src/types/settings.ts`

Na constante `CIDADES_BRASILEIRAS`, basta adicionar um novo objeto com a latitude, longitude e fuso horário oficial:

```ts
{
  id: 'belo_horizonte',
  nome: 'Belo Horizonte',
  estado: 'MG',
  lat: -19.9167,
  lon: -43.9345,
  tzOffset: -3,
  bioma: 'Cerrado e Mata Atlântica',
}
```

Uma vez adicionada à lista:
* A cidade aparece imediatamente no seletor de cidades da tela **Ajustes**.
* Ao selecionar a nova cidade, o algoritmo solar de `src/utils/astronomia.ts` recalcula os horários em minutos solares locais para cada dia do ano.

---

## 6. O que Ainda Falta ou Suposições Adotadas

Durante o desenvolvimento do Cyber Almanaque, foram feitas as seguintes premissas e opções de engenharia conscientes:

1. **Service Worker em iframes e ambientes de sandbox**: Em iframes de pré-visualização protegidos por sandbox (como o ambiente de preview do AI Studio), os navegadores Chromium podem restringir o registro de Service Workers com `SecurityError`. O aplicativo detecta e isola essa restrição de forma silenciosa e elegante: todo o armazenamento e funcionamento offline permanecem 100% ativos através do IndexedDB e do Web Storage. Ao publicar o app em domínio próprio com HTTPS ou executá-lo em janela cheia, o Service Worker (`/sw.js`) assume o controle total e realiza o cache Stale-While-Revalidate dos ativos estáticos.
2. **Fontes de Domínio Público e Verificação**: Todos os itens das seções (Manual de Sobrevivência, Conversando com Máquinas, Clima e Território, Atenção e Corpo, Direitos e Cidadania, Oficinas) foram marcados de forma transparente com a nota *"exemplo, verificar antes de publicar"*, conforme solicitado no briefing editorial original.
3. **Cálculos Astronômicos Locais**: Os cálculos solares e lunares não consultam nenhum serviço web de terceiros. Utilizam modelos esféricos e a fórmula de fase senoidal de Conway, calibrada para coordenadas brasileiras com desvio de poucos minutos em relação a efemérides náuticas.
4. **Sem Rastreadores nem APIs Proprietárias**: O aplicativo não utiliza Google Analytics, cookies de terceiros, pixels de conversão ou chamadas a modelos de linguagem na nuvem. A experiência é estritamente pessoal, íntima e soberana.

---

## 7. Deploy & Produção

* **URL de Produção (GitHub Pages)**: [https://zonaeducacional.github.io/almanaque/](https://zonaeducacional.github.io/almanaque/)
* **Repositório**: [https://github.com/zonaeducacional/almanaque](https://github.com/zonaeducacional/almanaque)

---

## 8. Changelog / Histórico de Modificações

* **v1.0.0 (2026-10-11)**:
  - Configuração do `base: '/almanaque/'` no Vite para suporte nativo ao GitHub Pages.
  - Ajuste de caminhos relativos em `manifest.json`, `index.html` e `registerServiceWorker.ts`.
  - Service Worker resiliente com detecção dinâmica de escopo (`self.registration.scope`) para funcionamento offline em subdiretórios.
  - Inclusão do arquivo `.nojekyll` para contornar processamento do Jekyll no GitHub Pages.
  - Criação do pipeline de CI/CD via GitHub Actions (`.github/workflows/deploy.yml`).
  - Deploy em produção via branch `gh-pages` e `main`.
