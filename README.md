# Tutorial Besu

## 1. Configuração Inicial do Ambiente

### Preparação de Diretórios

1. Crie um novo diretório para o projeto e abra-o no seu editor de código preferido
2. Dentro do diretório principal, crie duas pastas:
- Node-1
    - Crie uma subpasta `data` para armazenamento
- Node-2
    - Crie uma subpasta `data` para armazenamento

## 2. Configuração da Rede IBFT

### Configuração do Arquivo JSON

1. Crie um arquivo chamado `ibftConfigFile.json` na raiz do projeto
2. Adicione a seguinte configuração JSON que definirá os parâmetros da rede:
    - JSON
        
        ```json
        {
            "genesis": {
            "config": {
            "chainId": 1337,
            "berlinBlock": 0,
            "ibft2": {
            "blockperiodseconds": 2,
            "epochlength": 30000,
            "requesttimeoutseconds": 4
            }
        },
                "nonce": "0x0",
                "timestamp": "0x58ee40ba",
                "gasLimit": "0x47b760",
                "difficulty": "0x1",
                "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
                "coinbase": "0x0000000000000000000000000000000000000000",
                "alloc": {
                "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
                "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
                "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
                "balance": "0xad78ebc5ac6200000"
                },
                "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
                "privateKey": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
                "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
                },
                "f17f52151EbEF6C7334FAD080c5704D77216b732": {
                "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
                "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
                }
            }    
        },
        "blockchain": {
        "nodes": {
                "generate": true,
                "count": 2
                }
            }
        }
        ```
        

## 3. Geração da Configuração

### Configuração Inicial

1. Execute o seguinte comando no terminal para gerar a configuração da blockchain:

```bash
besu operator generate-blockchain-config --config-file=ibftConfigFile.json --to=networkFiles --private-key-file-name=key
```

Esse comando gera as configurações inicias para cada nodo na pasta `networkFiles`.

Cada pasta de `networkFiles` é a configuração de um nodo, logo devemos copiar e colar cada uma delas para a pasta `Node-1/data` e `Node-2/data` (Os dados `key` e [`key.pub`](http://key.pub) da primeira pasta de `networkFiles` será copiada em Node-1 e os da segunda em Node-2)

### Configuração de Permissões

Agora, em cada um das pastas data de cada nodo, deve ser criado um arquivo de configuração `permissions_config.toml` nele deve ser copiado o seguinte trecho:

```toml
accounts-allowlist=["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"]

nodes-allowlist=[]
```

Esses hashs são as contas criadas no arquivo genesis.

Copie o genesisfile.json criado em networkFile e cole ele na raiz do projeto

### Inicialização dos Nodos

Agora iniciaremos os nodos, para iniciar o nodo 1 entre no diretório do Node-1 pelo terminal e cole o seguinte trecho:

```bash
besu --data-path=data --genesis-file=../genesis.json --permissions-nodes-config-file-enabled --permissions-accounts-config-file-enabled --rpc-http-enabled --rpc-http-api=ADMIN,ETH,NET,PERM,IBFT --host-allowlist="*" --rpc-http-cors-origins="*" --profile=ENTERPRISE
```

Para iniciar o nodo 2 o comando é um pouco diferente, agora existe uma configuração de portas, não esqueça de entrar no diretório do nodo 2 :

```bash
besu --data-path=data --genesis-file=../genesis.json --permissions-nodes-config-file-enabled --permissions-accounts-config-file-enabled --rpc-http-enabled --rpc-http-api=ADMIN,ETH,NET,PERM,IBFT --host-allowlist="*<i>" --rpc-http-cors-origins="*</i>" --p2p-port=30304 --rpc-http-port=8546 --profile=ENTERPRISE
```

### Configuração de Permissões da Rede

Agora devemos dar permissão pela rede aos nodos criados, para adicionar o nodo 1 use:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["<EnodeNode1>","<EnodeNode2>"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

Para adicionar o nodo 2 use (Perceba que cada um tem uma porta diferente):

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["<EnodeNode1>","<EnodeNode2>"]], "id":1}' http://127.0.0.1:8546
```

### Verificação da Rede

É possível verificar as informações de quantos nodos estão permitidos na rede com o comando:

```bash
curl -X POST http://127.0.0.1:8545/ \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"perm_getNodesAllowlist","params":[],"id":1}'
```

Por fim, para configurar completamente a rede, devemos usar o seguinte comando para iniciar uma conexão peer to peer:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_addPeer","params":["<EnodeNode1>"],"id":1}' http://127.0.0.1:8546
```

É possível verificar quantas conexões peer estão ocorrendo com o comando:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545/ -H "Content-Type: application/json"
```

### Deploy de Contratos

Agora nós já temos uma rede Besu funcionando, basta criar os contratos e utiliza-la.

Para isso, faça o clone do seguinte repositório: [https://github.com/NevesRS/project-smart-contracts](https://github.com/NevesRS/project-smart-contracts)

Com os nodos ainda rodando, abra o repositório no editor de texto de preferência, e rode os seguintes comandos no terminal:

```bash
npx hardhat compile
```

Esse comando compila os contratos, gerando tudo que é necessário de configurações para dar deploy do contrato.

Agora, podemos dar deploy do contrato que criamos usando o script `deploy.ts`, para isso utilize o comando abaixo:

```bash
npx hardhat run scripts/deploy.ts --network besu
```

Esse comando irá retornar o endereço do contrato na nossa rede, esse endereço deve ser substituído no script `interact.ts`. Após substituir, rode o comando abaixo:

```bash
npx hardhat run scripts/interact.ts --network besu
```

Agora você verá no terminal o valor atual do contrato, você pode alterar como quiser o valor no método `setValor`, a cada nova requisição o valor é atualizado.
