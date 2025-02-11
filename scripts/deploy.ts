import { ethers } from "hardhat";
import { MeuContrato } from "../typechain-types";

async function main() {
  const MeuContratoFactory = await ethers.getContractFactory("MeuContrato");
  const meuContrato = await MeuContratoFactory.deploy();

  await meuContrato.waitForDeployment();

  const enderecoContrato = await meuContrato.getAddress();
  console.log("MeuContrato implantado no endereço:", enderecoContrato);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
