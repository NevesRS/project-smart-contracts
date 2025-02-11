pragma solidity ^0.8.28;
contract MeuContrato {
    uint256 public valor;

    function setValor(uint256 _valor) public {
        valor = _valor;
    }

    function getValor() public view returns (uint256) {
        return valor;
    }
}
