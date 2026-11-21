# Projeto Escrito - Cardápio Acessível

## 1. Visão geral
Este projeto propõe uma plataforma de cardápio digital acessível para pessoas com restrições alimentares, pessoas idosas e pessoas com deficiência visual. O objetivo é apoiar escolhas autônomas e seguras com informações claras sobre ingredientes, alérgenos e risco de contato cruzado.

## 2. Problema
Cardápios digitais podem apresentar informações incompletas ou pouco visíveis sobre ingredientes e alérgenos. Texto pequeno, linguagem vaga e filtros pouco acessíveis dificultam a consulta, especialmente para pessoas com baixa visão, cegueira, restrições alimentares ou menor familiaridade com tecnologia.

## 3. Objetivo geral
Projetar e avaliar um cardápio digital que facilite a consulta de pratos e de informações alimentares, com foco em autonomia, clareza, acessibilidade e segurança na tomada de decisão.

## 4. Público-alvo prioritário
- Pessoas com alergias e intolerâncias alimentares.
- Pessoas idosas ou com baixo letramento digital.
- Pessoas com deficiência visual e usuários de leitores de tela.

## 5. Metodologia
O projeto segue uma abordagem de Interação Humano-Computador centrada nas necessidades dos usuários:
1. Levantamento e organização de requisitos.
2. Pesquisa documental e benchmarking.
3. Prototipação iterativa.
4. Avaliação por tarefas e inspeção heurística.
5. Priorização de problemas e proposição de melhorias.

### 5.1 Ajuste metodológico
Não foram realizadas entrevistas específicas com pessoas com baixa visão nesta etapa. As necessidades relacionadas a esse público devem ser justificadas por bibliografia especializada, diretrizes de acessibilidade e validação futura com participantes desse perfil. Respostas de entrevista de exemplo não devem ser apresentadas como dados reais.

## 6. Requisitos funcionais iniciais
- RF01: buscar pratos por nome ou ingrediente.
- RF02: filtrar pratos por alérgenos a evitar.
- RF03: exibir ingredientes dos pratos.
- RF04: destacar alérgenos e informar sobre possível contato cruzado.
- RF05: apresentar preço e informações de decisão em linguagem clara.
- RF06: permitir ajuste do tamanho do texto.
- RF07: oferecer opções de contraste.

## 7. Requisitos não funcionais iniciais
- RNF01: considerar diretrizes de acessibilidade, incluindo WCAG 2.2.
- RNF02: permitir operação por teclado nos fluxos principais.
- RNF03: utilizar estrutura semântica compatível com tecnologias assistivas.
- RNF04: empregar linguagem simples e consistente.
- RNF05: evitar padrões manipulativos de interface.
- RNF06: minimizar coleta de dados pessoais.

## 8. Aspectos éticos e privacidade
- Obter consentimento livre e esclarecido em pesquisas com participantes.
- Anonimizar dados de pesquisa e coletar somente o necessário.
- Não apresentar dados simulados como resultados empíricos.
- Informar limitações dos dados de alérgenos e a necessidade de confirmar condições de preparo com o estabelecimento.
- Permitir que participantes desistam da pesquisa.

## 9. Avaliação
A avaliação prevista combina tarefas de uso e inspeção heurística. Os problemas devem ser registrados com evidências, heurísticas relacionadas, severidade e propostas de correção. Resultados de SUS só devem ser apresentados se o instrumento tiver sido aplicado a participantes reais e seus dados forem consolidados.

## 10. Tecnologias
- Frontend: React, TypeScript e Vite.
- Backend: Node.js, Express e TypeScript.

## 11. Artefatos
- Código-fonte do frontend e backend.
- Protótipo e documentação de requisitos.
- Relatórios de avaliação e evidências.
- Apresentação do projeto.

## 12. Estado do protótipo
O frontend apresenta busca e filtros por alérgenos, informações de pratos, preferências de acessibilidade e resumo de pedido. O backend disponibiliza uma API inicial de saúde e listagem de pratos. A integração entre essas partes deve ser validada antes de apresentar o sistema como solução completa.
