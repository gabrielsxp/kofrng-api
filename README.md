# The King of Fighters All Star Tools - Back End

The King of Fighters All Star é um jogo mobile que eu gosto bastante e jogo desde o lançamento em outro de 2019. Para a obtenção de novos personagens no jogo, o jogador deve obter rubis para realizar a invocação de um ou dez personagens ao mesmo tempo. A ideia deste projeto consiste em simular tais invocações, permitindo também a qualquer usuário registrado a criação customizada de qualquer banner de invocação presente no jogo.

O front-end para essa aplicação está em [The King of Fighters All Star Tools - Front-End](https://github.com/gabrielsxp/kofasrng)

### Tecnologias Utilizadas
- Javascript
- NodeJS
- MongoDB

## Funcionalidades
- Invocação de um ou dez personagens ao mesmo tempo
- Sistema de ranqueamento das invocações, de modo que a refletir a melhor invocação do dia (atualizada a cada 10 minutos)
- Presença de todos os banners presentes na versão global do jogo
- Estatísticas da quantidade total de rubis gastos e total de personagens de categoria obtidos
- Estatísticas globais da quantidade de rubis gastos e total de personagens obtidos no dia atual (atualizada a cada 1 hora) e no dia anterior (atualizado a cada 24 horas)
- Presença de gráficos para a representação de estatísticas, sejam elas de total de rubis ou de personagens adquiridos
- Opções de filtragem para a exibição dos banners de invocação quanto a disponibilidade dos mesmos na versão global do jogo
- Construtor de listas de ranqueamento dos personagens do jogo para qualquer usuário
- Divisão dos personagens do jogo quanto ao ano na página de contrução da lista de ranqueamento
- Presença de drag-and-drop para a contrução da lista de ranqueamento de personagens
- Opções de compartilhamento nas redes sociais de qualquer invocação, qualquer banner e qualquer lista de ranqueamento realizadas no website
- Sistema de cadastro de usuários com Bearer Token
- Sistema de login
- Sistema de recuperação de conta
- Sistema de alteração de senhas
- Dashboard personalizada para usuários cadastrados
- Presença de gráficos personalizados na Dashboard para a exibição do total de rubis gastos e total de personagens obtidos por categoria com opções de filtragem por tempo (7 dias, 15 dias, etc..)
- Sessão na Dashboard com todos os personagens obtidos pelo usuário no modo de invocação, com divisão por ano, a fim de chegar o mais próximo da opção de codex presente no jogo
- Usuários cadastrados podem adicionar qualquer invocação realizada no jogo na lista de favoritos presente na Dashboard
- Toda lista de ranqueamento de personagens criada por usuários cadastrados é salva e pode ser acessada posteriormente na opção presente na Dashboard
- Usuários cadastrados possuem a opção de criar um banner totalmente personalizado
- Os banners personalizados só podem ser criados a partir de uma pool de personagens, ou seja, uma lista pré-definida de personagens criada pelo próprio usuário na Dashboard.
- Na criação de pools, o usuário tem a opção de utilizar uma pool pré-definida criada pelo administrador, contendo todos os lutadores pré-definidos da versão global do jogo
- A pool é criada a partir de drag-and-drop, assim como a lista de ranqueamento
- Existem opções de filtragem dos lutadores na página de criação da pool personalizada, permitindo a filtragem quanto ao tipo, a cor, o estilo de luta  e a categoria
- Na criação do banner personalizado, é possível que o usuário defina uma imagem própria, ou utilizar a imagem pré-definida
- Na criação do banner personalizado, é possível que o usuário escolha o custo de cada invocação e o custo de 10 invocações
- Na criação do banner personalizado, é possível que o usário determine uma probabilidade de sorteio, ou poderá utilizar as probabilidades presentes no jogo atualmente
- Na criação do banner personalizado, é indispensável que o usuário escolha um pool que tenha criado anteriormente
- No caso de existirem personagens especiais na pool escolhida, é possível que o usuário defina exatamente a probabilidade que cada um dos personagens possuirá de ser sorteado
