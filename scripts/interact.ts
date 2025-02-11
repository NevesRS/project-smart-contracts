import { ethers } from "hardhat";
import { MeuContrato } from "../typechain-types";

async function main() {
  const enderecoContrato = "enderecoaqui"
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
