import { ethers } from "hardhat";
import { MeuContrato } from "../typechain-types";

async function main() {
  const enderecoContrato = "0xa50a51c09a5c451C52BB714527E1974b686D8e77";
  const MeuContratoFactory = await ethers.getContractFactory("MeuContrato");
  const meuContrato = MeuContratoFactory.attach(enderecoContrato) as MeuContrato;


  await meuContrato.setValor(42);
  const valor = await meuContrato.getValor();
  console.log("Valor atual:", valor.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
