# Guia rapido para agentes

Este ficheiro deve ser lido no inicio de cada novo pedido neste projeto. O objetivo e evitar uma exploracao completa da codebase quando o pedido pode ser resolvido seguindo este mapa.

## Projeto

- Frontend do CashManager, baseado em Next.js 15, React 19 e TypeScript.
- App Router em `src/app`.
- Alias principal: `@/*` aponta para `src/*`.
- Internacionalizacao com `next-intl`; mensagens em `messages/en.json` e `messages/pt.json`.
- Autenticacao baseada em cookie `token`; o middleware protege rotas privadas e redireciona para `/signin`.
- Backend configurado por `NEXT_PUBLIC_API_BACKEND_URL`.

## Comandos uteis

- Instalar dependencias: `npm install`.
- Desenvolvimento: `npm run dev`.
- Build: `npm run build`.
- Lint declarado: `npm run lint` (nota: em Next 15 este script pode precisar de ajuste se `next lint` nao estiver disponivel).

## Estrutura principal

- `src/app`: rotas, layouts e API routes/proxies.
- `src/app/(root)/(menu)`: paginas autenticadas principais, como dashboard, contas, dividas, objetivos financeiros, recorrentes e transacoes.
- `src/app/(full-width-pages)/(auth)`: paginas de autenticacao.
- `src/app/api`: endpoints internos do Next que fazem ponte para o backend.
- `src/features`: modulos por dominio, com componentes, hooks, tipos, estado e API de cada feature.
- `src/shared`: clientes API, hooks, tipos e UI reutilizavel.
- `src/components`: componentes globais de layout, UI, tabelas, graficos, formularios e landing.
- `src/context`: providers globais de sidebar e tema.

## Padroes de implementacao

- Procurar primeiro dentro de `src/features/<dominio>` quando o pedido for sobre uma area funcional especifica.
- Exports publicos de cada feature costumam estar em `src/features/<dominio>/index.ts`.
- Codigo server-side de features costuma estar em `src/features/<dominio>/server.ts`.
- Clientes API partilhados:
  - `src/shared/api/api-client.ts` contem o `request<T>`.
  - `src/shared/api/api-client.server.ts` injeta o token a partir dos cookies.
  - `src/shared/api/api-client.client.ts` e usado no lado cliente.
- Componentes partilhados de interface ficam em `src/shared/ui` ou `src/components/ui`; preferir estes antes de criar UI nova.
- Para rotas protegidas, considerar o comportamento de `src/middleware.ts`.
- Para textos visiveis, verificar e atualizar `messages/pt.json` e `messages/en.json` quando aplicavel.

## Dominios existentes

- `accounts`: contas, cartoes, filtros, graficos e dialogos.
- `auth`: login, registo, reset de password, verificacao de email e guards.
- `converter`: ferramenta de conversao.
- `dashboard`: metricas, widgets, graficos e objetivos.
- `debts` e `debt-payments`: dividas e pagamentos de dividas.
- `financial-goals` e `financial-goal-transactions`: objetivos financeiros e movimentos associados.
- `friends` e `invitations`: area social, amigos, pedidos e convites.
- `notifications`: feed, detalhe e leitura de notificacoes.
- `recurring`: movimentos recorrentes.
- `stocks`: componentes e tipos de acoes.
- `transactions`: transacoes, filtros, tabela, dialogs e resumo.

## Cuidados

- Nao reverter alteracoes existentes sem pedido explicito.
- Manter alteracoes pequenas e alinhadas com os padroes ja usados na feature afetada.
- Antes de editar, confirmar se ha componentes, hooks ou tipos ja existentes que resolvem o mesmo problema.
- Evitar varrer todo o projeto se este ficheiro e a feature relevante forem suficientes.
- Atualizar este ficheiro quando forem adicionados novos dominios, comandos importantes, convencoes ou mudancas estruturais.

## Notas recentes sobre Debts

- A listagem de dividas usa `DebtsContainer`, `DebtFilters`, `DebtsList` e cards baseados em `SummaryCard`.
- A pagina de detalhe de divida inclui a tabela de pagamentos atraves de `src/features/debt-payments/components/containers/TableContainer.tsx`.
- O dialog de adicionar/editar pagamento e `src/features/debt-payments/components/dialogs/FormPaymentDialog.tsx`; manter selects alinhados com `CustomSelect` e grelhas responsivas `sm:grid-cols-2`.
- A pagina independente de pagamentos de dividas usa `PaymentsContainer` com header principal + `NewDebtPaymentsButton`, e a tabela/filtros vivem em `TableContainer`.
- `DebtPaymentsDataTable` deve manter a tabela compacta; dados secundarios como juros pagos e descricao ficam no modal de detalhes aberto ao clicar na linha.
- Dialogs de pagamentos (`ConfirmPaymentDialog`, `DeletePaymentDialog`, `FormPaymentDialog`) devem manter `Dialog`, copy traduzida, iconografia `lucide-react` e botoes consistentes (`app_cancel`, `app_submit`, `destructive`).
- No `FormPaymentDialog`, o modo editar deve seguir layout 1-2-1: data full-width, valor/juros em duas colunas responsivas, descricao full-width.
- Dialogs de dividas (`DeleteDebtDialog`, `MarkDebtPaidDialog`) usam o componente `Dialog`, iconografia `lucide-react`, copy traduzida e botoes `app_cancel`/`app_submit` ou `destructive`.
- Para formularios de dividas, `DebtForm` usa cards da app, `CustomSelect` para moeda, `DatePicker` para datas e uma sidebar de resumo calculado.
