// Dados importados e processados do Base44
import { Student, Technique, LessonPlan, AttendanceRecord, PaymentRecord } from '../types';

export const BASE44_STUDENTS: Student[] = [
  {
    "id": "6a30227dacccaf9cc51482cd",
    "nome": "Enzo",
    "email": "enzo@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2026-05-30",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-05-30",
    "presencasNaFaixa": 3,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 3,
    "plano": "projeto_social",
    "valorMensalidade": 0.0,
    "diaVencimento": 10,
    "statusPagamento": "isento",
    "observacoesMedicas": "Responsável: Jeferson; Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 75,
      "finalizacoesAplicadas": 6,
      "raspagensFeitas": 9
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6a5fceff1a71e1e878a34e15-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fceff1a71e1e878a34e15-6922a95c5b7776e29fc63663",
        "techniqueId": "6922a95c5b7776e29fc63663",
        "titulo": "O-soto gari",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "69c188b4ef911e5e175d922e",
    "nome": "Erick Dias Brito",
    "email": "jussaradiaspaz@gmail.com",
    "telefone": "917972954",
    "dataNascimento": "informar",
    "dataInicio": "2026-03-23",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-03-23",
    "presencasNaFaixa": 0,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 0,
    "plano": "regular",
    "valorMensalidade": 180.0,
    "diaVencimento": 10,
    "statusPagamento": "pendente",
    "observacoesMedicas": "Responsável: Jussara Dias; Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": false,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 0,
      "finalizacoesAplicadas": 0,
      "raspagensFeitas": 0
    },
    "tecnicasAprendidas": []
  },
  {
    "id": "69c187d7eb47cb038a64d4d0",
    "nome": "Jonathan Ribeiro",
    "email": "jonathan.rib.almeida@gmail.com",
    "telefone": "11968659628",
    "dataNascimento": "1996-03-31",
    "dataInicio": "2026-03-23",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-03-23",
    "presencasNaFaixa": 9,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 9,
    "plano": "regular",
    "valorMensalidade": 180.0,
    "diaVencimento": 10,
    "statusPagamento": "em_dia",
    "observacoesMedicas": "informar",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 225,
      "finalizacoesAplicadas": 18,
      "raspagensFeitas": 27
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6a77a47a5196a40093f9afb9-6a77334d95021c3c74a0d34d",
        "techniqueId": "6a77334d95021c3c74a0d34d",
        "titulo": "Braço preso da Borboleta",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a47a5196a40093f9afb9-6a7730642ba3fc23f347cc12",
        "techniqueId": "6a7730642ba3fc23f347cc12",
        "titulo": "Single Leg com Finalização no Leg Lock",
        "categoria": "Queda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a47a5196a40093f9afb9-69a85a58e0fc237734c51116",
        "techniqueId": "69a85a58e0fc237734c51116",
        "titulo": "Joelho na Barriga (Knee Slice / Knee Cut)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a47a5196a40093f9afb9-69a85a6165ce0fc7c074b16f",
        "techniqueId": "69a85a6165ce0fc7c074b16f",
        "titulo": "Gancho Borboleta (Butterfly Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d541d6aa3ce624258-6a63c37e12154d5dac842672",
        "techniqueId": "6a63c37e12154d5dac842672",
        "titulo": "Defesa da Omoplata — Virada por Cima (Step Over)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d541d6aa3ce624258-6a63c366c6f83d8bf4996d3c",
        "techniqueId": "6a63c366c6f83d8bf4996d3c",
        "titulo": "Defesa da Omoplata — Cambalhota",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d541d6aa3ce624258-69a85a6f5cf199a495c7179e",
        "techniqueId": "69a85a6f5cf199a495c7179e",
        "titulo": "Omoplata",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f0280de6e685622a9ee-69a85a528947265dada8f880",
        "techniqueId": "69a85a528947265dada8f880",
        "titulo": "Bahiana (Double Leg Takedown)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f0280de6e685622a9ee-69a85a6f2680a2065e7495d2",
        "techniqueId": "69a85a6f2680a2065e7495d2",
        "titulo": "Chave de Pé Reta (Botinha / Straight Ankle Lock)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f0280de6e685622a9ee-69a85a77845ca6fcaa6ca11f",
        "techniqueId": "69a85a77845ca6fcaa6ca11f",
        "titulo": "Defesa da Kimura",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f0280de6e685622a9ee-69a85a6b82dc728216da3906",
        "techniqueId": "69a85a6b82dc728216da3906",
        "titulo": "Kimura",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fceff924cfec9cc20e08c-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fceff924cfec9cc20e08c-6922a95c5b7776e29fc63663",
        "techniqueId": "6922a95c5b7776e29fc63663",
        "titulo": "O-soto gari",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a524576b65a1a334923fdba-69a85a73242d250ba78b25f4",
        "techniqueId": "69a85a73242d250ba78b25f4",
        "titulo": "Katagatame (Arm Triangle / Kata Gatame)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a524576b65a1a334923fdba-69a85a6f9cb42d18dd695545",
        "techniqueId": "69a85a6f9cb42d18dd695545",
        "titulo": "Norte-Sul (North South Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a524576b65a1a334923fdba-69a85a56d60d5f72553750e0",
        "techniqueId": "69a85a56d60d5f72553750e0",
        "titulo": "Harai Goshi",
        "categoria": "Queda",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a524576b65a1a334923fdba-69a85a545461f9dbf5d87a04",
        "techniqueId": "69a85a545461f9dbf5d87a04",
        "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b988a9885073593e0459-69a85a61d816e0a357cbc272",
        "techniqueId": "69a85a61d816e0a357cbc272",
        "titulo": "Balança (Pendulum Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b988a9885073593e0459-69a85a610c92de42315d72b1",
        "techniqueId": "69a85a610c92de42315d72b1",
        "titulo": "Tesoura (Scissor Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b988a9885073593e0459-6a368c5b8b47fa4596d00d69",
        "techniqueId": "6a368c5b8b47fa4596d00d69",
        "titulo": "Sasae Tsurikomi Ashi (Gi e No Gi)",
        "categoria": "Queda",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b988a9885073593e0459-69a85a6dcf180478d29dd66f",
        "techniqueId": "69a85a6dcf180478d29dd66f",
        "titulo": "Arco e Flecha (Bow and Arrow Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cf548a4918b92816f4-69a85a6b9457a7425ece369b",
        "techniqueId": "69a85a6b9457a7425ece369b",
        "titulo": "Triângulo (Triangle Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cf548a4918b92816f4-69a85a6e05d7c24f3cedb2d4",
        "techniqueId": "69a85a6e05d7c24f3cedb2d4",
        "titulo": "Paper Cutter Choke",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cf548a4918b92816f4-69a85a75c1e0142563208c31",
        "techniqueId": "69a85a75c1e0142563208c31",
        "titulo": "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cf548a4918b92816f4-69a85a75d6cd472632a68061",
        "techniqueId": "69a85a75d6cd472632a68061",
        "titulo": "Defesa da Montada — Ponte e Rolo (Upa Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cf548a4918b92816f4-69a85a563ce4fad215fdebd7",
        "techniqueId": "69a85a563ce4fad215fdebd7",
        "titulo": "Tai Otoshi",
        "categoria": "Queda",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc12b3a750763f180cd-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc12b3a750763f180cd-69a85a588db0497ce1a0c491",
        "techniqueId": "69a85a588db0497ce1a0c491",
        "titulo": "Queda por Fora da Perna (Osoto Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859808ad5fbbc6a3476-6922a83b754dab7555e74ec4",
        "techniqueId": "6922a83b754dab7555e74ec4",
        "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
        "categoria": "Finalização",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859808ad5fbbc6a3476-69a85a551903592fe29e9bf5",
        "techniqueId": "69a85a551903592fe29e9bf5",
        "titulo": "Uchi Mata",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859808ad5fbbc6a3476-69a85a57361ac92034289794",
        "techniqueId": "69a85a57361ac92034289794",
        "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "69b59aa4d3902ead7c2612fd",
    "nome": "Luca",
    "email": "luca@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2026-03-14",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-03-14",
    "presencasNaFaixa": 5,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 5,
    "plano": "projeto_social",
    "valorMensalidade": 0.0,
    "diaVencimento": 10,
    "statusPagamento": "isento",
    "observacoesMedicas": "Responsável: Jeferson; Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 125,
      "finalizacoesAplicadas": 10,
      "raspagensFeitas": 15
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6a5fcf0055917c1ca5de278d-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fcf0055917c1ca5de278d-6922a95c5b7776e29fc63663",
        "techniqueId": "6922a95c5b7776e29fc63663",
        "titulo": "O-soto gari",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69b59fefeb3240cb7247e5d2-69a85a545461f9dbf5d87a04",
        "techniqueId": "69a85a545461f9dbf5d87a04",
        "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-14",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69b59fefeb3240cb7247e5d2-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-14",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "69923205bb1beebfa451eb72",
    "nome": "Heitor",
    "email": "heitor@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2026-02-15",
    "faixa": "amarela",
    "graus": 1,
    "dataUltimaGraduacao": "2026-02-15",
    "presencasNaFaixa": 1,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 1,
    "plano": "regular",
    "valorMensalidade": 180.0,
    "diaVencimento": 10,
    "statusPagamento": "pendente",
    "observacoesMedicas": "informar",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": false,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 25,
      "finalizacoesAplicadas": 2,
      "raspagensFeitas": 3
    },
    "tecnicasAprendidas": []
  },
  {
    "id": "699231c36c90200fa83c8578",
    "nome": "Rafaela",
    "email": "rafaela@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2026-02-15",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-02-15",
    "presencasNaFaixa": 5,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 5,
    "plano": "regular",
    "valorMensalidade": 180.0,
    "diaVencimento": 10,
    "statusPagamento": "pendente",
    "observacoesMedicas": "Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": false,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 125,
      "finalizacoesAplicadas": 10,
      "raspagensFeitas": 15
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-69e8e790ccae2a3b358294d5-69e37fd2e34e79bd96f7ba9c",
        "techniqueId": "69e37fd2e34e79bd96f7ba9c",
        "titulo": "Passagem de Guarda em Pé Manga Cruzada",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e790ccae2a3b358294d5-69e37f85f77b375e077d0423",
        "techniqueId": "69e37f85f77b375e077d0423",
        "titulo": "Passagem de Guarda em Pé Manga Paralela",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e790ccae2a3b358294d5-69a85a556714f064d1565902",
        "techniqueId": "69a85a556714f064d1565902",
        "titulo": "Desequilíbrio de Cabeça (Snap Down)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e790ccae2a3b358294d5-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e790ccae2a3b358294d5-69a85a6e05d7c24f3cedb2d4",
        "techniqueId": "69a85a6e05d7c24f3cedb2d4",
        "titulo": "Paper Cutter Choke",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc37e3ab2823277b6d8-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc37e3ab2823277b6d8-69a85a588db0497ce1a0c491",
        "techniqueId": "69a85a588db0497ce1a0c491",
        "titulo": "Queda por Fora da Perna (Osoto Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885e624e50d07b1b61c7-6922a83b754dab7555e74ec4",
        "techniqueId": "6922a83b754dab7555e74ec4",
        "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
        "categoria": "Finalização",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885e624e50d07b1b61c7-69a85a551903592fe29e9bf5",
        "techniqueId": "69a85a551903592fe29e9bf5",
        "titulo": "Uchi Mata",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885e624e50d07b1b61c7-69a85a57361ac92034289794",
        "techniqueId": "69a85a57361ac92034289794",
        "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "698780ef0663cdb43d0d7963",
    "nome": "Nathalie",
    "email": "nathalie@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2026-02-07",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2026-02-07",
    "presencasNaFaixa": 1,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 1,
    "plano": "projeto_social",
    "valorMensalidade": 0.0,
    "diaVencimento": 10,
    "statusPagamento": "isento",
    "observacoesMedicas": "informar",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": false,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 25,
      "finalizacoesAplicadas": 2,
      "raspagensFeitas": 3
    },
    "tecnicasAprendidas": []
  },
  {
    "id": "68fd0955de4e44d137a8a2c0",
    "nome": "Breno",
    "email": "breno@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2025-10-25",
    "faixa": "branca",
    "graus": 0,
    "dataUltimaGraduacao": "2025-10-25",
    "presencasNaFaixa": 16,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 16,
    "plano": "projeto_social",
    "valorMensalidade": 0.0,
    "diaVencimento": 10,
    "statusPagamento": "isento",
    "observacoesMedicas": "Responsável: Daniela; Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 400,
      "finalizacoesAplicadas": 32,
      "raspagensFeitas": 48
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6ac17b6003446a26a72facd2-69a85a5850d152eb1ac33a3e",
        "techniqueId": "69a85a5850d152eb1ac33a3e",
        "titulo": "Projeção de Ombro (Seoi Nage)",
        "categoria": "Queda",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6ac17b6003446a26a72facd2-69a85a57b01da4292afca82b",
        "techniqueId": "69a85a57b01da4292afca82b",
        "titulo": "Queda de Pé (Foot Sweep / Ashi Barai)",
        "categoria": "Queda",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6ac17b6003446a26a72facd2-69a85a61d816e0a357cbc272",
        "techniqueId": "69a85a61d816e0a357cbc272",
        "titulo": "Balança (Pendulum Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e8f3807a1a4a40e006c-69a85a6aa4935bc3dd03faca",
        "techniqueId": "69a85a6aa4935bc3dd03faca",
        "titulo": "Chave de Braço (Armbar / Juji Gatame)",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e8f3807a1a4a40e006c-69a85a6b82dc728216da3906",
        "techniqueId": "69a85a6b82dc728216da3906",
        "titulo": "Kimura",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e8f3807a1a4a40e006c-69a85a610c92de42315d72b1",
        "techniqueId": "69a85a610c92de42315d72b1",
        "titulo": "Tesoura (Scissor Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e8f3807a1a4a40e006c-69a85a75c1e0142563208c31",
        "techniqueId": "69a85a75c1e0142563208c31",
        "titulo": "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e8f3807a1a4a40e006c-68f7e1b7a27df674c6254824",
        "techniqueId": "68f7e1b7a27df674c6254824",
        "titulo": "Armlock da guarda com pé no quadril",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4dd20552dbd332c750-6a63c37e12154d5dac842672",
        "techniqueId": "6a63c37e12154d5dac842672",
        "titulo": "Defesa da Omoplata — Virada por Cima (Step Over)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4dd20552dbd332c750-6a63c366c6f83d8bf4996d3c",
        "techniqueId": "6a63c366c6f83d8bf4996d3c",
        "titulo": "Defesa da Omoplata — Cambalhota",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4dd20552dbd332c750-69a85a6f5cf199a495c7179e",
        "techniqueId": "69a85a6f5cf199a495c7179e",
        "titulo": "Omoplata",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f027a7f622f7c151700-69a85a528947265dada8f880",
        "techniqueId": "69a85a528947265dada8f880",
        "titulo": "Bahiana (Double Leg Takedown)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f027a7f622f7c151700-69a85a6f2680a2065e7495d2",
        "techniqueId": "69a85a6f2680a2065e7495d2",
        "titulo": "Chave de Pé Reta (Botinha / Straight Ankle Lock)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f027a7f622f7c151700-69a85a77845ca6fcaa6ca11f",
        "techniqueId": "69a85a77845ca6fcaa6ca11f",
        "titulo": "Defesa da Kimura",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fceff55e63ad35ca8907a-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fceff55e63ad35ca8907a-6922a95c5b7776e29fc63663",
        "techniqueId": "6922a95c5b7776e29fc63663",
        "titulo": "O-soto gari",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a52457604108a7c9321ac99-69a85a73242d250ba78b25f4",
        "techniqueId": "69a85a73242d250ba78b25f4",
        "titulo": "Katagatame (Arm Triangle / Kata Gatame)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a52457604108a7c9321ac99-69a85a6f9cb42d18dd695545",
        "techniqueId": "69a85a6f9cb42d18dd695545",
        "titulo": "Norte-Sul (North South Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a52457604108a7c9321ac99-69a85a56d60d5f72553750e0",
        "techniqueId": "69a85a56d60d5f72553750e0",
        "titulo": "Harai Goshi",
        "categoria": "Queda",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a52457604108a7c9321ac99-69a85a545461f9dbf5d87a04",
        "techniqueId": "69a85a545461f9dbf5d87a04",
        "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78d6c171b9f5fe16178-69e37fd2e34e79bd96f7ba9c",
        "techniqueId": "69e37fd2e34e79bd96f7ba9c",
        "titulo": "Passagem de Guarda em Pé Manga Cruzada",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78d6c171b9f5fe16178-69e37f85f77b375e077d0423",
        "techniqueId": "69e37f85f77b375e077d0423",
        "titulo": "Passagem de Guarda em Pé Manga Paralela",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78d6c171b9f5fe16178-69a85a556714f064d1565902",
        "techniqueId": "69a85a556714f064d1565902",
        "titulo": "Desequilíbrio de Cabeça (Snap Down)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78d6c171b9f5fe16178-69a85a6e05d7c24f3cedb2d4",
        "techniqueId": "69a85a6e05d7c24f3cedb2d4",
        "titulo": "Paper Cutter Choke",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc02c3a8b7f8bedf079-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc02c3a8b7f8bedf079-69a85a588db0497ce1a0c491",
        "techniqueId": "69a85a588db0497ce1a0c491",
        "titulo": "Queda por Fora da Perna (Osoto Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859a7d59ae2e9fd50d3-6922a83b754dab7555e74ec4",
        "techniqueId": "6922a83b754dab7555e74ec4",
        "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
        "categoria": "Finalização",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859a7d59ae2e9fd50d3-69a85a551903592fe29e9bf5",
        "techniqueId": "69a85a551903592fe29e9bf5",
        "titulo": "Uchi Mata",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c18859a7d59ae2e9fd50d3-69a85a57361ac92034289794",
        "techniqueId": "69a85a57361ac92034289794",
        "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "68fd093257d92252431ccc5b",
    "nome": "Julia Lopes de Moraes",
    "email": "julia.lopes.de.moraes@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2025-10-25",
    "faixa": "verde",
    "graus": 1,
    "dataUltimaGraduacao": "2025-10-25",
    "presencasNaFaixa": 17,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 17,
    "plano": "projeto_social",
    "valorMensalidade": 0.0,
    "diaVencimento": 10,
    "statusPagamento": "isento",
    "observacoesMedicas": "Responsável: Thiago Lopes de Moraes Silva; Menor de 16 anos",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 425,
      "finalizacoesAplicadas": 34,
      "raspagensFeitas": 51
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6ac17b615198944ca11be171-69a85a5850d152eb1ac33a3e",
        "techniqueId": "69a85a5850d152eb1ac33a3e",
        "titulo": "Projeção de Ombro (Seoi Nage)",
        "categoria": "Queda",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6ac17b615198944ca11be171-69a85a57b01da4292afca82b",
        "techniqueId": "69a85a57b01da4292afca82b",
        "titulo": "Queda de Pé (Foot Sweep / Ashi Barai)",
        "categoria": "Queda",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6ac17b615198944ca11be171-69a85a61d816e0a357cbc272",
        "techniqueId": "69a85a61d816e0a357cbc272",
        "titulo": "Balança (Pendulum Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-10-03",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e9064bf19d2692888bc-69a85a6aa4935bc3dd03faca",
        "techniqueId": "69a85a6aa4935bc3dd03faca",
        "titulo": "Chave de Braço (Armbar / Juji Gatame)",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e9064bf19d2692888bc-69a85a6b82dc728216da3906",
        "techniqueId": "69a85a6b82dc728216da3906",
        "titulo": "Kimura",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e9064bf19d2692888bc-69a85a610c92de42315d72b1",
        "techniqueId": "69a85a610c92de42315d72b1",
        "titulo": "Tesoura (Scissor Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e9064bf19d2692888bc-69a85a75c1e0142563208c31",
        "techniqueId": "69a85a75c1e0142563208c31",
        "titulo": "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e9064bf19d2692888bc-68f7e1b7a27df674c6254824",
        "techniqueId": "68f7e1b7a27df674c6254824",
        "titulo": "Armlock da guarda com pé no quadril",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a4792f5c4d54b8bc3ee0-6a77334d95021c3c74a0d34d",
        "techniqueId": "6a77334d95021c3c74a0d34d",
        "titulo": "Braço preso da Borboleta",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a4792f5c4d54b8bc3ee0-6a7730642ba3fc23f347cc12",
        "techniqueId": "6a7730642ba3fc23f347cc12",
        "titulo": "Single Leg com Finalização no Leg Lock",
        "categoria": "Queda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a4792f5c4d54b8bc3ee0-69a85a58e0fc237734c51116",
        "techniqueId": "69a85a58e0fc237734c51116",
        "titulo": "Joelho na Barriga (Knee Slice / Knee Cut)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a4792f5c4d54b8bc3ee0-69a85a6165ce0fc7c074b16f",
        "techniqueId": "69a85a6165ce0fc7c074b16f",
        "titulo": "Gancho Borboleta (Butterfly Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4ec62f73c02f936d72-6a63c37e12154d5dac842672",
        "techniqueId": "6a63c37e12154d5dac842672",
        "titulo": "Defesa da Omoplata — Virada por Cima (Step Over)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4ec62f73c02f936d72-6a63c366c6f83d8bf4996d3c",
        "techniqueId": "6a63c366c6f83d8bf4996d3c",
        "titulo": "Defesa da Omoplata — Cambalhota",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4ec62f73c02f936d72-69a85a6f5cf199a495c7179e",
        "techniqueId": "69a85a6f5cf199a495c7179e",
        "titulo": "Omoplata",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b9881dccd105e200c480-6a368c5b8b47fa4596d00d69",
        "techniqueId": "6a368c5b8b47fa4596d00d69",
        "titulo": "Sasae Tsurikomi Ashi (Gi e No Gi)",
        "categoria": "Queda",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a36b9881dccd105e200c480-69a85a6dcf180478d29dd66f",
        "techniqueId": "69a85a6dcf180478d29dd66f",
        "titulo": "Arco e Flecha (Bow and Arrow Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-06-20",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78e6835260c5720b259-69e37fd2e34e79bd96f7ba9c",
        "techniqueId": "69e37fd2e34e79bd96f7ba9c",
        "titulo": "Passagem de Guarda em Pé Manga Cruzada",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78e6835260c5720b259-69e37f85f77b375e077d0423",
        "techniqueId": "69e37f85f77b375e077d0423",
        "titulo": "Passagem de Guarda em Pé Manga Paralela",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78e6835260c5720b259-69a85a556714f064d1565902",
        "techniqueId": "69a85a556714f064d1565902",
        "titulo": "Desequilíbrio de Cabeça (Snap Down)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78e6835260c5720b259-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78e6835260c5720b259-69a85a6e05d7c24f3cedb2d4",
        "techniqueId": "69a85a6e05d7c24f3cedb2d4",
        "titulo": "Paper Cutter Choke",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cff3db2d84ed158b60-69a85a6b9457a7425ece369b",
        "techniqueId": "69a85a6b9457a7425ece369b",
        "titulo": "Triângulo (Triangle Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cff3db2d84ed158b60-69a85a75d6cd472632a68061",
        "techniqueId": "69a85a75d6cd472632a68061",
        "titulo": "Defesa da Montada — Ponte e Rolo (Upa Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260cff3db2d84ed158b60-69a85a563ce4fad215fdebd7",
        "techniqueId": "69a85a563ce4fad215fdebd7",
        "titulo": "Tai Otoshi",
        "categoria": "Queda",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc2988d40abf67b94a4-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c84fc2988d40abf67b94a4-69a85a588db0497ce1a0c491",
        "techniqueId": "69a85a588db0497ce1a0c491",
        "titulo": "Queda por Fora da Perna (Osoto Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-28",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885b593b2837c0ece803-6922a83b754dab7555e74ec4",
        "techniqueId": "6922a83b754dab7555e74ec4",
        "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
        "categoria": "Finalização",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885b593b2837c0ece803-69a85a551903592fe29e9bf5",
        "techniqueId": "69a85a551903592fe29e9bf5",
        "titulo": "Uchi Mata",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885b593b2837c0ece803-69a85a57361ac92034289794",
        "techniqueId": "69a85a57361ac92034289794",
        "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69b59fee67faa33b041913aa-69a85a545461f9dbf5d87a04",
        "techniqueId": "69a85a545461f9dbf5d87a04",
        "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-14",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  },
  {
    "id": "68fd090b94a9ff66f66c7093",
    "nome": "Augusto",
    "email": "augusto@informar.com",
    "telefone": "informar",
    "dataNascimento": "informar",
    "dataInicio": "2025-10-25",
    "faixa": "azul",
    "graus": 1,
    "dataUltimaGraduacao": "2025-10-25",
    "presencasNaFaixa": 1,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 1,
    "plano": "regular",
    "valorMensalidade": 180.0,
    "diaVencimento": 10,
    "statusPagamento": "pendente",
    "observacoesMedicas": "informar",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": false,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 25,
      "finalizacoesAplicadas": 2,
      "raspagensFeitas": 3
    },
    "tecnicasAprendidas": []
  },
  {
    "id": "68f7dd1df8a8c1b4a9813794",
    "nome": "Murilo Fernandes da Silva",
    "email": "murilofernandes801@gmail.com",
    "telefone": "11942492669",
    "dataNascimento": "2004-09-10",
    "dataInicio": "2025-10-21",
    "faixa": "roxa",
    "graus": 2,
    "dataUltimaGraduacao": "2026-06-05",
    "presencasNaFaixa": 18,
    "presencasMetaGrau": 40,
    "totalPresencasHistorico": 18,
    "plano": "bolsista",
    "valorMensalidade": 108.0,
    "diaVencimento": 10,
    "statusPagamento": "em_dia",
    "observacoesMedicas": "informar",
    "tamanhoKimono": "informar",
    "pesoKg": 75.0,
    "turmaPreferida": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "sistemaGraduacao": "graus_e_faixas",
    "ativo": true,
    "performance": {
      "guarda": 7.5,
      "passagem": 7.0,
      "quedas": 6.5,
      "finalizacoes": 7.0,
      "defesa": 7.5,
      "disciplina": 9.0,
      "tempoRolaMinutos": 450,
      "finalizacoesAplicadas": 36,
      "raspagensFeitas": 54
    },
    "tecnicasAprendidas": [
      {
        "id": "lt-6a899e90665330f996016043-69a85a6aa4935bc3dd03faca",
        "techniqueId": "69a85a6aa4935bc3dd03faca",
        "titulo": "Chave de Braço (Armbar / Juji Gatame)",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e90665330f996016043-69a85a6b82dc728216da3906",
        "techniqueId": "69a85a6b82dc728216da3906",
        "titulo": "Kimura",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e90665330f996016043-69a85a610c92de42315d72b1",
        "techniqueId": "69a85a610c92de42315d72b1",
        "titulo": "Tesoura (Scissor Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e90665330f996016043-69a85a75c1e0142563208c31",
        "techniqueId": "69a85a75c1e0142563208c31",
        "titulo": "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a899e90665330f996016043-68f7e1b7a27df674c6254824",
        "techniqueId": "68f7e1b7a27df674c6254824",
        "titulo": "Armlock da guarda com pé no quadril",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-15",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a479cbc0c8e23116ad72-6a77334d95021c3c74a0d34d",
        "techniqueId": "6a77334d95021c3c74a0d34d",
        "titulo": "Braço preso da Borboleta",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a479cbc0c8e23116ad72-6a7730642ba3fc23f347cc12",
        "techniqueId": "6a7730642ba3fc23f347cc12",
        "titulo": "Single Leg com Finalização no Leg Lock",
        "categoria": "Queda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a479cbc0c8e23116ad72-69a85a58e0fc237734c51116",
        "techniqueId": "69a85a58e0fc237734c51116",
        "titulo": "Joelho na Barriga (Knee Slice / Knee Cut)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a77a479cbc0c8e23116ad72-69a85a6165ce0fc7c074b16f",
        "techniqueId": "69a85a6165ce0fc7c074b16f",
        "titulo": "Gancho Borboleta (Butterfly Sweep)",
        "categoria": "Raspagem",
        "dataAprendida": "2026-08-08",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d64a946c9e5b7388b-6a63c37e12154d5dac842672",
        "techniqueId": "6a63c37e12154d5dac842672",
        "titulo": "Defesa da Omoplata — Virada por Cima (Step Over)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d64a946c9e5b7388b-6a63c366c6f83d8bf4996d3c",
        "techniqueId": "6a63c366c6f83d8bf4996d3c",
        "titulo": "Defesa da Omoplata — Cambalhota",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a71dd4d64a946c9e5b7388b-69a85a6f5cf199a495c7179e",
        "techniqueId": "69a85a6f5cf199a495c7179e",
        "titulo": "Omoplata",
        "categoria": "Finalização",
        "dataAprendida": "2026-08-01",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f037f67dc2d16956307-69a85a528947265dada8f880",
        "techniqueId": "69a85a528947265dada8f880",
        "titulo": "Bahiana (Double Leg Takedown)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f037f67dc2d16956307-69a85a6f2680a2065e7495d2",
        "techniqueId": "69a85a6f2680a2065e7495d2",
        "titulo": "Chave de Pé Reta (Botinha / Straight Ankle Lock)",
        "categoria": "Finalização",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a688f037f67dc2d16956307-69a85a77845ca6fcaa6ca11f",
        "techniqueId": "69a85a77845ca6fcaa6ca11f",
        "titulo": "Defesa da Kimura",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-07-25",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fcf009d0620f8059594e2-69a85a52e5894f0c61a9a31a",
        "techniqueId": "69a85a52e5894f0c61a9a31a",
        "titulo": "Arrasto de Braço (Arm Drag)",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-6a5fcf009d0620f8059594e2-6922a95c5b7776e29fc63663",
        "techniqueId": "6922a95c5b7776e29fc63663",
        "titulo": "O-soto gari",
        "categoria": "Queda",
        "dataAprendida": "2026-07-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78f47a222c0ef204834-69e37fd2e34e79bd96f7ba9c",
        "techniqueId": "69e37fd2e34e79bd96f7ba9c",
        "titulo": "Passagem de Guarda em Pé Manga Cruzada",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78f47a222c0ef204834-69e37f85f77b375e077d0423",
        "techniqueId": "69e37f85f77b375e077d0423",
        "titulo": "Passagem de Guarda em Pé Manga Paralela",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78f47a222c0ef204834-69a85a556714f064d1565902",
        "techniqueId": "69a85a556714f064d1565902",
        "titulo": "Desequilíbrio de Cabeça (Snap Down)",
        "categoria": "Queda",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69e8e78f47a222c0ef204834-69a85a6e05d7c24f3cedb2d4",
        "techniqueId": "69a85a6e05d7c24f3cedb2d4",
        "titulo": "Paper Cutter Choke",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-18",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260d098ed228d11d8edc7-69a85a6b9457a7425ece369b",
        "techniqueId": "69a85a6b9457a7425ece369b",
        "titulo": "Triângulo (Triangle Choke)",
        "categoria": "Finalização",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260d098ed228d11d8edc7-69a85a75d6cd472632a68061",
        "techniqueId": "69a85a75d6cd472632a68061",
        "titulo": "Defesa da Montada — Ponte e Rolo (Upa Escape)",
        "categoria": "Defesa Pessoal",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69d260d098ed228d11d8edc7-69a85a563ce4fad215fdebd7",
        "techniqueId": "69a85a563ce4fad215fdebd7",
        "titulo": "Tai Otoshi",
        "categoria": "Queda",
        "dataAprendida": "2026-04-04",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885dce67a61306f9d562-6922a83b754dab7555e74ec4",
        "techniqueId": "6922a83b754dab7555e74ec4",
        "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
        "categoria": "Finalização",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885dce67a61306f9d562-69a85a551903592fe29e9bf5",
        "techniqueId": "69a85a551903592fe29e9bf5",
        "titulo": "Uchi Mata",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69c1885dce67a61306f9d562-69a85a57361ac92034289794",
        "techniqueId": "69a85a57361ac92034289794",
        "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-21",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69b59fefcbc28e053efd0c13-69a85a545461f9dbf5d87a04",
        "techniqueId": "69a85a545461f9dbf5d87a04",
        "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
        "categoria": "Queda",
        "dataAprendida": "2026-03-14",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      },
      {
        "id": "lt-69b59fefcbc28e053efd0c13-69a85a5fb944dbf8b55a07df",
        "techniqueId": "69a85a5fb944dbf8b55a07df",
        "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
        "categoria": "Passagem de Guarda",
        "dataAprendida": "2026-03-14",
        "turmaNome": "Jiu-Jitsu de Sábado",
        "professorNome": "Thiago Lopes de Moraes Silva"
      }
    ]
  }
];

export const BASE44_TECHNIQUES: Technique[] = [
  {
    "id": "6aa55539c0ce1d425e86d3a2",
    "titulo": "Triângulo Brimbolando da Guarda Laçada",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "informar",
    "pontosChave": [
      "informar"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a9c2426e3eab8647d488780",
    "titulo": "Guilhotina do 4 apoios",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Guilhotina puxando o oponente para cima mantendo dentro da guarda.",
    "pontosChave": [
      "Guilhotina puxando o oponente para cima mantendo dentro da guarda"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a77334d95021c3c74a0d34d",
    "titulo": "Braço preso da Borboleta",
    "categoria": "Raspagem",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "informar",
    "pontosChave": [
      "informar"
    ],
    "tags": [
      "Raspagem",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a7730642ba3fc23f347cc12",
    "titulo": "Single Leg com Finalização no Leg Lock",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Entrada com ducking, laçando a perna do oponente com a perna de dentro.",
    "pontosChave": [
      "Entrada com ducking, laçando a perna do oponente com a perna de dentro"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "https://www.youtube.com/watch?v=KUzuzo1MePA"
  },
  {
    "id": "6a63c37e12154d5dac842672",
    "titulo": "Defesa da Omoplata — Virada por Cima (Step Over)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "azul",
    "nivel": "Intermediário",
    "tipo": "Ambos",
    "descricao": "Com a omoplata encaixada, gire o corpo acompanhando o movimento da finalização. Passe a perna por cima da cabeça do adversário e continue a rotação até liberar o ombro. Após escapar, estabilize a posição, buscando a passagem de guarda ou outra posição dominante.",
    "pontosChave": [
      "Com a omoplata encaixada, gire o corpo acompanhando o movimento da finalização",
      "Passe a perna por cima da cabeça do adversário e continue a rotação até liberar o ombro",
      "Após escapar, estabilize a posição, buscando a passagem de guarda ou outra posição dominante"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a63c366c6f83d8bf4996d3c",
    "titulo": "Defesa da Omoplata — Cambalhota",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "azul",
    "nivel": "Intermediário",
    "tipo": "Ambos",
    "descricao": "Quando a omoplata estiver encaixada e não for mais possível recuperar a postura, faça uma cambalhota para frente acompanhando a direção da pressão. O rolamento alivia a torção no ombro e permite sair da finalização, frequentemente terminando por cima do adversário ou recuperando uma posição neutra.",
    "pontosChave": [
      "Quando a omoplata estiver encaixada e não for mais possível recuperar a postura, faça uma cambalhota para frente acompanhando a direção da pressão",
      "O rolamento alivia a torção no ombro e permite sair da finalização, frequentemente terminando por cima do adversário ou recuperando uma posição neutra"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a63c34fdc4ad649d60469ff",
    "titulo": "Defesa da Omoplata — Postura",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "azul",
    "nivel": "Intermediário",
    "tipo": "Ambos",
    "descricao": "Assim que o adversário começar a atacar a omoplata, mantenha a postura ereta, cabeça levantada e peito aberto. Evite que seu ombro seja projetado para frente e mantenha o cotovelo próximo ao corpo. Antes que o adversário sente o quadril e controle sua postura, recupere a base e retire o braço da linha de ataque.",
    "pontosChave": [
      "Assim que o adversário começar a atacar a omoplata, mantenha a postura ereta, cabeça levantada e peito aberto",
      "Evite que seu ombro seja projetado para frente e mantenha o cotovelo próximo ao corpo",
      "Antes que o adversário sente o quadril e controle sua postura, recupere a base e retire o braço da linha de ataque"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6a368c5b8b47fa4596d00d69",
    "titulo": "Sasae Tsurikomi Ashi (Gi e No Gi)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "No-Gi",
    "descricao": "Fazer pegada no braço e na gola, sair para o lado da gola aproximando do oponente e calçar o pé do oponente do lado do braço. Variação - Sair para o lado normalmente e depois inverter o lado com um salto e fazer o calço invertido. No Gi - A saida lateral é invertida. A pegada da gola deve ser por baixo da axila e depois sai para o lado do braço.",
    "pontosChave": [
      "Fazer pegada no braço e na gola, sair para o lado da gola aproximando do oponente e calçar o pé do oponente do lado do braço",
      "Variação - Sair para o lado normalmente e depois inverter o lado com um salto e fazer o calço invertido",
      "No Gi - A saida lateral é invertida",
      "A pegada da gola deve ser por baixo da axila e depois sai para o lado do braço"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "https://www.youtube.com/shorts/NDWkTMmXSGQ"
  },
  {
    "id": "69ff3421a5c32ea4a5faabe8",
    "titulo": "Estrangulamento do 4 apoios pegando a perna e rolando por cima",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "informar",
    "pontosChave": [
      "informar"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "69ff3251252e971ba829d5a7",
    "titulo": "Estrangulamento do quatro apoios traingulo de mão invertido",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Na lateral do 4 apoios, entra com a mão do lado do oponente, por baixo da axila. Faz a pegada de cintbelt com o cotovelo na nuca. Entra o joelho pordentro e apoia a lateral da cabeça.",
    "pontosChave": [
      "Na lateral do 4 apoios, entra com a mão do lado do oponente, por baixo da axila",
      "Faz a pegada de cintbelt com o cotovelo na nuca",
      "Entra o joelho pordentro e apoia a lateral da cabeça"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "69f87eb2006feaff3496e30c",
    "titulo": "Uki Waza (Variação)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Inicia com pegada padrão. Soltar a mão da manga e fazer uma pegada  no braço cruzado por baixo da mão que está na gola. A mão da gola sobre e busca o pano nas costas.",
    "pontosChave": [
      "Inicia com pegada padrão",
      "Soltar a mão da manga e fazer uma pegada  no braço cruzado por baixo da mão que está na gola",
      "A mão da gola sobre e busca o pano nas costas"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "69e37fd2e34e79bd96f7ba9c",
    "titulo": "Passagem de Guarda em Pé Manga Cruzada",
    "categoria": "Passagem de Guarda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Uma mão no kimono na boca do estomago. A outra mão pega a manga do braço cruzado. Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura. Ao subir troca a mão da manga e a outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo.",
    "pontosChave": [
      "Uma mão no kimono na boca do estomago",
      "A outra mão pega a manga do braço cruzado",
      "Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura",
      "Ao subir troca a mão da manga e a outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo"
    ],
    "tags": [
      "Passagem de Guarda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "69e37f85f77b375e077d0423",
    "titulo": "Passagem de Guarda em Pé Manga Paralela",
    "categoria": "Passagem de Guarda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Uma mão no kimono na boca do estomago. A outra mão pega a manga do braço paralelo. Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura. A outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo.",
    "pontosChave": [
      "Uma mão no kimono na boca do estomago",
      "A outra mão pega a manga do braço paralelo",
      "Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura",
      "A outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo"
    ],
    "tags": [
      "Passagem de Guarda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "69a85a795544fe6344627f48",
    "titulo": "Drill de Rolamento para Trás",
    "categoria": "Drill",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Sente no solo com as pernas dobradas. Role para trás dobrando o queixo ao peito e levando os joelhos ao rosto. Passe pelo ombro (não pela nuca) mantendo a cabeça inclinada para o lado. Ao sair, levante em base técnica.",
    "pontosChave": [
      "Sente no solo com as pernas dobradas",
      "Role para trás dobrando o queixo ao peito e levando os joelhos ao rosto",
      "Passe pelo ombro (não pela nuca) mantendo a cabeça inclinada para o lado",
      "Ao sair, levante em base técnica"
    ],
    "tags": [
      "Drill",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a78d4c47760680cedd7",
    "titulo": "Drill de Rolamento para Frente",
    "categoria": "Drill",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Agache com os pés na largura dos ombros. Apoie uma mão no chão ligeiramente à frente. Baixe a cabeça para o lado, colocando o queixo no peito. Roleie pelo ombro em arco diagonal.",
    "pontosChave": [
      "Agache com os pés na largura dos ombros",
      "Apoie uma mão no chão ligeiramente à frente",
      "Baixe a cabeça para o lado, colocando o queixo no peito",
      "Roleie pelo ombro em arco diagonal"
    ],
    "tags": [
      "Drill",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a78ab79ebc0136eadef",
    "titulo": "Drill de Ponte (Bridge Drill)",
    "categoria": "Drill",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Deite de costas com os joelhos dobrados e pés apoiados no chão próximos aos glúteos. Eleve o quadril o máximo possível de forma explosiva, contraindo glúteos e abrindo a coluna.",
    "pontosChave": [
      "Deite de costas com os joelhos dobrados e pés apoiados no chão próximos aos glúteos",
      "Eleve o quadril o máximo possível de forma explosiva, contraindo glúteos e abrindo a coluna"
    ],
    "tags": [
      "Drill",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a78b6f0499f113757f8",
    "titulo": "Drill de Saída de Quadril (Shrimp Drill)",
    "categoria": "Drill",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Deite de costas com o corpo estendido. Empurre o chão com um pé, girando levemente o quadril e deslizando-o para trás.",
    "pontosChave": [
      "Deite de costas com o corpo estendido",
      "Empurre o chão com um pé, girando levemente o quadril e deslizando-o para trás"
    ],
    "tags": [
      "Drill",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a7734001b27794a6c09",
    "titulo": "Defesa da Chave de Pé Reta (Straight Ankle Lock Escape)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando em chave de pé reta, controle o joelho adversário com a mão do lado da perna atacada. Gire o pé na direção do dedão para aliviar a pressão do tendão.",
    "pontosChave": [
      "Quando em chave de pé reta, controle o joelho adversário com a mão do lado da perna atacada",
      "Gire o pé na direção do dedão para aliviar a pressão do tendão"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a77c467e32e08e10cf2",
    "titulo": "Defesa da Guilhotina (Guillotine Escape — Lateral)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando preso na guilhotina, controle o quadril adversário com a mão do mesmo lado do braço estrangulante. Leve a cabeça para o lado oposto ao braço estrangulante.",
    "pontosChave": [
      "Quando preso na guilhotina, controle o quadril adversário com a mão do mesmo lado do braço estrangulante",
      "Leve a cabeça para o lado oposto ao braço estrangulante"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a772839e8c5925004bc",
    "titulo": "Defesa da Chave de Braço (Armbar Escape — Stack)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando preso no armbar, una as mãos (figura quatro) antes da extensão total. Empilhe o adversário aproximando os joelhos do adversário ao peito (stack).",
    "pontosChave": [
      "Quando preso no armbar, una as mãos (figura quatro) antes da extensão total",
      "Empilhe o adversário aproximando os joelhos do adversário ao peito (stack)"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a77845ca6fcaa6ca11f",
    "titulo": "Defesa da Kimura",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando o adversário tenta aplicar kimura, segure sua própria calça ou entrelace as mãos bloqueando a rotação. Gire o corpo para dentro do adversário.",
    "pontosChave": [
      "Quando o adversário tenta aplicar kimura, segure sua própria calça ou entrelace as mãos bloqueando a rotação",
      "Gire o corpo para dentro do adversário"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a76f0ef94d08c95266a",
    "titulo": "Defesa da Americana",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando o adversário começa a aplicar americana, una as mãos impedindo que o braço forme o ângulo de 90°. Estenda o braço para baixo colado ao corpo.",
    "pontosChave": [
      "Quando o adversário começa a aplicar americana, una as mãos impedindo que o braço forme o ângulo de 90°",
      "Estenda o braço para baixo colado ao corpo"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a76d60d5f72553750f3",
    "titulo": "Defesa do Triângulo (Triangle Escape — Postura)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando capturado no triângulo, endireite a coluna imediatamente levantando a cabeça. Segure a calça adversária com a mão livre para estabilizar.",
    "pontosChave": [
      "Quando capturado no triângulo, endireite a coluna imediatamente levantando a cabeça",
      "Segure a calça adversária com a mão livre para estabilizar"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a7618ae881392ec4b43",
    "titulo": "Defesa do Mata-Leão (RNC Escape)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Quando o braço adversário tenta se encaixar no pescoço, coloque imediatamente as duas mãos no braço atacante, baixe o queixo para dificultar o encaixe. Gire o corpo na direção do braço atacante.",
    "pontosChave": [
      "Quando o braço adversário tenta se encaixar no pescoço, coloque imediatamente as duas mãos no braço atacante, baixe o queixo para dificultar o encaixe",
      "Gire o corpo na direção do braço atacante"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a75c1e0142563208c31",
    "titulo": "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Proteja o pescoço e feche os cotovelos para dentro. Faça movimentos de quadril curtos e explosivos (bump) para criar espaço.",
    "pontosChave": [
      "Proteja o pescoço e feche os cotovelos para dentro",
      "Faça movimentos de quadril curtos e explosivos (bump) para criar espaço"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a75d6cd472632a68061",
    "titulo": "Defesa da Montada — Ponte e Rolo (Upa Escape)",
    "categoria": "Defesa Pessoal",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da posição montada, proteja o pescoço fechando os cotovelos. Prenda o braço do oponente do mesmo lado que vai rolar. Plante o pé no chão e execute ponte explosiva.",
    "pontosChave": [
      "Da posição montada, proteja o pescoço fechando os cotovelos",
      "Prenda o braço do oponente do mesmo lado que vai rolar",
      "Plante o pé no chão e execute ponte explosiva"
    ],
    "tags": [
      "Defesa Pessoal",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a7354b7a428c9475e9e",
    "titulo": "Arm Triangle",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Posicione-se perpendicularmente ao adversário com o braço adversário preso entre sua cabeça e ombro. Feche o triângulo passando o braço por baixo do pescoço adversário e unindo as mãos.",
    "pontosChave": [
      "Posicione-se perpendicularmente ao adversário com o braço adversário preso entre sua cabeça e ombro",
      "Feche o triângulo passando o braço por baixo do pescoço adversário e unindo as mãos"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a73242d250ba78b25f4",
    "titulo": "Katagatame (Arm Triangle / Kata Gatame)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da montada ou cruzada, prenda o braço adversário contra o pescoço dele mesmo. Apoie o ombro no rosto adversário. Una as mãos.",
    "pontosChave": [
      "Da montada ou cruzada, prenda o braço adversário contra o pescoço dele mesmo",
      "Apoie o ombro no rosto adversário",
      "Una as mãos"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a728bc654bb1b97ccea",
    "titulo": "Estrangulamento Relógio (Clock Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da posição de turtle, insira a mão na gola adversária e passe o braço ao redor da cabeça. Circule o próprio corpo ao redor da cabeça adversária como um ponteiro de relógio.",
    "pontosChave": [
      "Da posição de turtle, insira a mão na gola adversária e passe o braço ao redor da cabeça",
      "Circule o próprio corpo ao redor da cabeça adversária como um ponteiro de relógio"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a701ed505462d64a588",
    "titulo": "Chave de Joelho (Kneebar)",
    "categoria": "Finalização",
    "faixaMinima": "azul",
    "nivel": "Intermediário",
    "tipo": "Ambos",
    "descricao": "Posicione o joelho adversário contra o seu quadril ou tronco como ponto de fulcro. Controle o joelho com ambos os braços. Estenda o quadril em direção ao joelho.",
    "pontosChave": [
      "Posicione o joelho adversário contra o seu quadril ou tronco como ponto de fulcro",
      "Controle o joelho com ambos os braços",
      "Estenda o quadril em direção ao joelho"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6f2680a2065e7495d2",
    "titulo": "Chave de Pé Reta (Botinha / Straight Ankle Lock)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Controle o tornozelo adversário entre suas axilas. Prenda a perna adversária entre seus braços e tronco. Estenda o quadril para trás enquanto levanta o tornozelo.",
    "pontosChave": [
      "Controle o tornozelo adversário entre suas axilas",
      "Prenda a perna adversária entre seus braços e tronco",
      "Estenda o quadril para trás enquanto levanta o tornozelo"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6f5cf199a495c7179e",
    "titulo": "Omoplata",
    "categoria": "Finalização",
    "faixaMinima": "azul",
    "nivel": "Intermediário",
    "tipo": "Ambos",
    "descricao": "Da guarda, controle um braço adversário com as duas pernas. Gire o quadril 90° isolando o ombro adversário entre suas coxas. Sente-se, abraçando a cintura adversária.",
    "pontosChave": [
      "Da guarda, controle um braço adversário com as duas pernas",
      "Gire o quadril 90° isolando o ombro adversário entre suas coxas",
      "Sente-se, abraçando a cintura adversária"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6f9cb42d18dd695545",
    "titulo": "Norte-Sul (North South Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da posição norte-sul, insira o braço sob a cabeça adversária encostando o ombro no rosto. Deslize o ombro contra o pescoço enquanto aperta com os braços.",
    "pontosChave": [
      "Da posição norte-sul, insira o braço sob a cabeça adversária encostando o ombro no rosto",
      "Deslize o ombro contra o pescoço enquanto aperta com os braços"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6e05d7c24f3cedb2d4",
    "titulo": "Paper Cutter Choke",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da posição lateral, segure a gola/lapela adversária com uma mão. Use o antebraço como uma faca deslizando contra a artéria carótida.",
    "pontosChave": [
      "Da posição lateral, segure a gola/lapela adversária com uma mão",
      "Use o antebraço como uma faca deslizando contra a artéria carótida"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6dad35f160f5b44018",
    "titulo": "Ezequiel (Ezekiel Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da montada ou meia guarda, insira uma mão pela manga do seu próprio kimono. Posicione o antebraço através do pescoço adversário e puxe com a mão livre.",
    "pontosChave": [
      "Da montada ou meia guarda, insira uma mão pela manga do seu próprio kimono",
      "Posicione o antebraço através do pescoço adversário e puxe com a mão livre"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6dcf180478d29dd66f",
    "titulo": "Arco e Flecha (Bow and Arrow Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Das costas adversárias, segure a lapela adversária com uma mão e a calça no joelho com a outra. Estenda o corpo tensionando a lapela e a perna como um arco.",
    "pontosChave": [
      "Das costas adversárias, segure a lapela adversária com uma mão e a calça no joelho com a outra",
      "Estenda o corpo tensionando a lapela e a perna como um arco"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6dc9e784f79e836c5f",
    "titulo": "Estrangulamento Cruzado (Cross Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da montada ou guarda, insira uma mão na lapela adversária com o polegar por dentro e a segunda mão cruzando por baixo segurando a lapela do outro lado.",
    "pontosChave": [
      "Da montada ou guarda, insira uma mão na lapela adversária com o polegar por dentro e a segunda mão cruzando por baixo segurando a lapela do outro lado"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6cce254da1e5d6b9aa",
    "titulo": "Mata-Leão (Rear Naked Choke / RNC)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Das costas do adversário com ganchos, passe o braço de ataque sob o queixo, bíceps no pescoço. Segure o bíceps oposto e feche a nuca.",
    "pontosChave": [
      "Das costas do adversário com ganchos, passe o braço de ataque sob o queixo, bíceps no pescoço",
      "Segure o bíceps oposto e feche a nuca"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6c99da3b43c15be2a8",
    "titulo": "Guilhotina Baixa (Arm-In Guillotine)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Com controle da cabeça, antebraço sob o pescoço e mãos entrelaçadas em frente ao peito adversário, comprimindo a garganta.",
    "pontosChave": [
      "Com controle da cabeça, antebraço sob o pescoço e mãos entrelaçadas em frente ao peito adversário, comprimindo a garganta"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6c04e48296d6cd18ec",
    "titulo": "Guilhotina Alta (High Elbow Guillotine)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Com a cabeça do adversário no clinch, antebraço sob o queixo com cotovelo elevado acima do ombro. Aperto explosivo.",
    "pontosChave": [
      "Com a cabeça do adversário no clinch, antebraço sob o queixo com cotovelo elevado acima do ombro",
      "Aperto explosivo"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6b9457a7425ece369b",
    "titulo": "Triângulo (Triangle Choke)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da guarda, controle um braço adversário puxando para dentro e passe a perna sobre o ombro. Feche o triângulo (pé atrás do joelho oposto).",
    "pontosChave": [
      "Da guarda, controle um braço adversário puxando para dentro e passe a perna sobre o ombro",
      "Feche o triângulo (pé atrás do joelho oposto)"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6b82dc728216da3906",
    "titulo": "Kimura",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Controle o punho adversário com uma mão e passe o outro braço por cima travando em quatro. Gire em direção às costas com cotovelo elevado.",
    "pontosChave": [
      "Controle o punho adversário com uma mão e passe o outro braço por cima travando em quatro",
      "Gire em direção às costas com cotovelo elevado"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6aa4935bc3dd03faca",
    "titulo": "Chave de Braço (Armbar / Juji Gatame)",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Isole o braço do adversário entre suas pernas com polegar para cima. Eleve o quadril empurrando o cotovelo enquanto puxa o punho.",
    "pontosChave": [
      "Isole o braço do adversário entre suas pernas com polegar para cima",
      "Eleve o quadril empurrando o cotovelo enquanto puxa o punho"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a63498d825caa7ebbf2",
    "titulo": "Raspagem De La Riva (De La Riva Sweep)",
    "categoria": "Raspagem",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da guarda De La Riva, segure a manga e o tornozelo. Puxe a manga desequilibrando e empurre com o gancho até o adversário tombar.",
    "pontosChave": [
      "Da guarda De La Riva, segure a manga e o tornozelo",
      "Puxe a manga desequilibrando e empurre com o gancho até o adversário tombar"
    ],
    "tags": [
      "Raspagem",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a6165ce0fc7c074b16f",
    "titulo": "Gancho Borboleta (Butterfly Sweep)",
    "categoria": "Raspagem",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da guarda borboleta com ganchos internos, controle o tronco com underhook. Incline lateralmente elevando o gancho e suba montando.",
    "pontosChave": [
      "Da guarda borboleta com ganchos internos, controle o tronco com underhook",
      "Incline lateralmente elevando o gancho e suba montando"
    ],
    "tags": [
      "Raspagem",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a61d816e0a357cbc272",
    "titulo": "Balança (Pendulum Sweep)",
    "categoria": "Raspagem",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da guarda fechada, balance a perna livre em arco amplo ganhando momentum para tombar o adversário para o lado da manga puxada.",
    "pontosChave": [
      "Da guarda fechada, balance a perna livre em arco amplo ganhando momentum para tombar o adversário para o lado da manga puxada"
    ],
    "tags": [
      "Raspagem",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a610c92de42315d72b1",
    "titulo": "Tesoura (Scissor Sweep)",
    "categoria": "Raspagem",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Da guarda fechada, canela no abdômen e perna de baixo no joelho adversário. Tesoure as pernas puxando a manga para derrubar.",
    "pontosChave": [
      "Da guarda fechada, canela no abdômen e perna de baixo no joelho adversário",
      "Tesoure as pernas puxando a manga para derrubar"
    ],
    "tags": [
      "Raspagem",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a5fb944dbf8b55a07df",
    "titulo": "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
    "categoria": "Passagem de Guarda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Pressione o ombro diretamente no rosto/queixo adversário enquanto avança os joelhos até a montada ou 100kg.",
    "pontosChave": [
      "Pressione o ombro diretamente no rosto/queixo adversário enquanto avança os joelhos até a montada ou 100kg"
    ],
    "tags": [
      "Passagem de Guarda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a58e0fc237734c51116",
    "titulo": "Joelho na Barriga (Knee Slice / Knee Cut)",
    "categoria": "Passagem de Guarda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Deslize o joelho de ataque sobre a coxa adversária cortando a guarda com pressão de tronco e termine no 100kg.",
    "pontosChave": [
      "Deslize o joelho de ataque sobre a coxa adversária cortando a guarda com pressão de tronco e termine no 100kg"
    ],
    "tags": [
      "Passagem de Guarda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a5850d152eb1ac33a3e",
    "titulo": "Projeção de Ombro (Seoi Nage)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Com pegada de gola e manga, gire 180° agachando o quadril sob o oponente e lance-o por sobre o ombro.",
    "pontosChave": [
      "Com pegada de gola e manga, gire 180° agachando o quadril sob o oponente e lance-o por sobre o ombro"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a588db0497ce1a0c491",
    "titulo": "Queda por Fora da Perna (Osoto Gari)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "No clinch, varra a perna traseira do adversário com o jarrete empurrando o tronco para trás com vigor.",
    "pontosChave": [
      "No clinch, varra a perna traseira do adversário com o jarrete empurrando o tronco para trás com vigor"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a57361ac92034289794",
    "titulo": "Queda por Dentro da Perna (Ouchi Gari)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Avance na base e varra a perna interna do oponente de dentro para fora puxando a gola para desequilibrar para trás.",
    "pontosChave": [
      "Avance na base e varra a perna interna do oponente de dentro para fora puxando a gola para desequilibrar para trás"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a57b01da4292afca82b",
    "titulo": "Queda de Pé (Foot Sweep / Ashi Barai)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Varra o tornozelo adversário no momento exato da transferência de peso usando pegada de gola e manga.",
    "pontosChave": [
      "Varra o tornozelo adversário no momento exato da transferência de peso usando pegada de gola e manga"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a57ef159aae32bc51fa",
    "titulo": "Fireman Carry",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Abaixe o nível e passe o braço do oponente sobre seus ombros como carregar nos ombros, projetando-o ao chão.",
    "pontosChave": [
      "Abaixe o nível e passe o braço do oponente sobre seus ombros como carregar nos ombros, projetando-o ao chão"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a565af76bdcc9531baf",
    "titulo": "Sumi Gaeshi",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Queda sacrifício com gancho na coxa interna e pé no quadril, girando o oponente por cima em arco.",
    "pontosChave": [
      "Queda sacrifício com gancho na coxa interna e pé no quadril, girando o oponente por cima em arco"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a563ce4fad215fdebd7",
    "titulo": "Tai Otoshi",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Bloqueio externo da perna dianteira do oponente com puxada forte de manga e tronco.",
    "pontosChave": [
      "Bloqueio externo da perna dianteira do oponente com puxada forte de manga e tronco"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a56d60d5f72553750e0",
    "titulo": "Harai Goshi",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Varredura das coxas do adversário com quadril projetado e giro de ombros com pegada firme.",
    "pontosChave": [
      "Varredura das coxas do adversário com quadril projetado e giro de ombros com pegada firme"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a551903592fe29e9bf5",
    "titulo": "Uchi Mata",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Pé entre as pernas e varredura da coxa interna adversária para o alto lançando o adversário no tatame.",
    "pontosChave": [
      "Pé entre as pernas e varredura da coxa interna adversária para o alto lançando o adversário no tatame"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a556714f064d1565902",
    "titulo": "Desequilíbrio de Cabeça (Snap Down)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Puxe a cabeça do adversário explosivamente quebrando a postura para atacar pernas ou costas.",
    "pontosChave": [
      "Puxe a cabeça do adversário explosivamente quebrando a postura para atacar pernas ou costas"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a545461f9dbf5d87a04",
    "titulo": "Queda de Quadril (Hip Throw / Ogoshi)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Avanço de quadril sob o oponente com abraço na cintura e projeção por cima das costas.",
    "pontosChave": [
      "Avanço de quadril sob o oponente com abraço na cintura e projeção por cima das costas"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a52e5894f0c61a9a31a",
    "titulo": "Arrasto de Braço (Arm Drag)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Cruzamento do braço do adversário pelo peito com passo rápido nas costas para derrubada.",
    "pontosChave": [
      "Cruzamento do braço do adversário pelo peito com passo rápido nas costas para derrubada"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "69a85a52242d250ba78b24bd",
    "titulo": "Single Leg",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Entrada de cabeça no peito/abdômen abraçando uma única perna e erguendo para queda.",
    "pontosChave": [
      "Entrada de cabeça no peito/abdômen abraçando uma única perna e erguendo para queda"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "https://www.youtube.com/watch?v=KUzuzo1MePA"
  },
  {
    "id": "69a85a528947265dada8f880",
    "titulo": "Bahiana (Double Leg Takedown)",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Passo de penetração explosivo abraçando os dois joelhos e dirigindo o adversário ao solo.",
    "pontosChave": [
      "Passo de penetração explosivo abraçando os dois joelhos e dirigindo o adversário ao solo"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "▶ Assistir"
  },
  {
    "id": "698782e720f0b0288d56a253",
    "titulo": "Crucifixo no gi",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "No-Gi",
    "descricao": "Controle de um braço com as pernas e outro com os braços sem kimono.",
    "pontosChave": [
      "Controle de um braço com as pernas e outro com os braços sem kimono"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6987825920a5c0ecbe1ae77c",
    "titulo": "Crucifixo com rolamento por cima",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Trocar a perna que laça o braço, jogar o corpo por cima com auxílio da perna livre",
    "pontosChave": [
      "Trocar a perna que laça o braço, jogar o corpo por cima com auxílio da perna livre"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6987817f2ccf62939c758576",
    "titulo": "Estrangulamento das costas cruzando o braço e segurando uma lapela",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Gi",
    "descricao": "Importante, entrar bem a mão na gola e aproximar a cabeça da cabeça do oponente",
    "pontosChave": [
      "Importante, entrar bem a mão na gola e aproximar a cabeça da cabeça do oponente"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "697ddbbbcf82d4feb3db5f3e",
    "titulo": "Passagem abraçando as pernas",
    "categoria": "Passagem de Guarda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Abraçar uma mão por baixo outra por cima e deslizar de ombro passando do lado abraçado por cima.",
    "pontosChave": [
      "Abraçar uma mão por baixo outra por cima e deslizar de ombro passando do lado abraçado por cima"
    ],
    "tags": [
      "Passagem de Guarda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6922a95c5b7776e29fc63663",
    "titulo": "O-soto gari",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Queda clássica de judô varrendo por fora da perna com empurrão de gola.",
    "pontosChave": [
      "Queda clássica de judô varrendo por fora da perna com empurrão de gola"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6922a8f1ab1da2732578c0ff",
    "titulo": "Morote seoi nage",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Entrada de seoi nage com as duas mãos segurando a gola e manga, flexionando e projetando.",
    "pontosChave": [
      "Entrada de seoi nage com as duas mãos segurando a gola e manga, flexionando e projetando"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6922a8cf3cb5cd44408ba8cf",
    "titulo": "O-uchi gari",
    "categoria": "Queda",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Queda por dentro da perna com gancho na parte interna e desequilíbrio para trás.",
    "pontosChave": [
      "Queda por dentro da perna com gancho na parte interna e desequilíbrio para trás"
    ],
    "tags": [
      "Queda",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "6922a83b754dab7555e74ec4",
    "titulo": "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga, pegada estilo baseball, rotacionando o corpo ajoelhando próximo a cabeça.",
    "pontosChave": [
      "Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga, pegada estilo baseball, rotacionando o corpo ajoelhando próximo a cabeça"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  },
  {
    "id": "68f7e1b7a27df674c6254824",
    "titulo": "Armlock da guarda com pé no quadril",
    "categoria": "Finalização",
    "faixaMinima": "branca",
    "nivel": "Iniciante",
    "tipo": "Ambos",
    "descricao": "Armlock da guarda com pé no quadril e jogando a outra perna na axila. Detalhes: Saída de quadril, adução e mão no pescoço.",
    "pontosChave": [
      "Armlock da guarda com pé no quadril e jogando a outra perna na axila",
      "Detalhes: Saída de quadril, adução e mão no pescoço"
    ],
    "tags": [
      "Finalização",
      "Base44",
      "Currículo"
    ],
    "videoUrl": "informar"
  }
];

export const BASE44_LESSON_PLANS: LessonPlan[] = [
  {
    "id": "6ac17c34d41b169bfe299656",
    "data": "2026-10-03",
    "semanaCiclo": 1,
    "temaPrincipal": "Projeção de Ombro (Seoi Nage), Queda de Pé (Foot Sweep / Ashi Barai), Balança (Pendulum Sweep)",
    "observacoes": "informar",
    "tecnicas": [
      "Projeção de Ombro (Seoi Nage)",
      "Queda de Pé (Foot Sweep / Ashi Barai)",
      "Balança (Pendulum Sweep)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6aa55418e294f8556609341d",
    "data": "2026-09-12",
    "semanaCiclo": 2,
    "temaPrincipal": "Defesa do Triângulo (Triangle Escape — Postura), Triângulo (Triangle Choke), Triângulo Brimbolando da Guarda Laçada",
    "observacoes": "informar",
    "tecnicas": [
      "Defesa do Triângulo (Triangle Escape — Postura)",
      "Triângulo (Triangle Choke)",
      "Triângulo Brimbolando da Guarda Laçada"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a9c248c1021c607faaada15",
    "data": "2026-09-05",
    "semanaCiclo": 3,
    "temaPrincipal": "Guilhotina Alta (High Elbow Guillotine), Guilhotina Baixa (Arm-In Guillotine), Guilhotina do 4 apoios",
    "observacoes": "informar",
    "tecnicas": [
      "Guilhotina Alta (High Elbow Guillotine)",
      "Guilhotina Baixa (Arm-In Guillotine)",
      "Guilhotina do 4 apoios"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a89a06b8907ab4db3327e19",
    "data": "2026-08-22",
    "semanaCiclo": 4,
    "temaPrincipal": "Raspagem segurando um braço e a queda quando o adversário solta",
    "observacoes": "Raspagem segurando um braço e a queda quando o adversário solta",
    "tecnicas": [
      "Raspagem De La Riva (De La Riva Sweep)",
      "Fireman Carry",
      "Estrangulamento Cruzado (Cross Choke)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a806c13e2683f0c99c09d17",
    "data": "2026-08-15",
    "semanaCiclo": 1,
    "temaPrincipal": "Chave de Braço (Armbar / Juji Gatame), Kimura, Tesoura (Scissor Sweep)",
    "observacoes": "informar",
    "tecnicas": [
      "Chave de Braço (Armbar / Juji Gatame)",
      "Kimura",
      "Tesoura (Scissor Sweep)",
      "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
      "Armlock da guarda com pé no quadril"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a7732720b13251007bff9a9",
    "data": "2026-08-08",
    "semanaCiclo": 2,
    "temaPrincipal": "Braço preso da Borboleta, Single Leg com Finalização no Leg Lock, Joelho na Barriga (Knee Slice / Knee Cut)",
    "observacoes": "informar",
    "tecnicas": [
      "Braço preso da Borboleta",
      "Single Leg com Finalização no Leg Lock",
      "Joelho na Barriga (Knee Slice / Knee Cut)",
      "Gancho Borboleta (Butterfly Sweep)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a6debe6960465daa2fe350b",
    "data": "2026-08-01",
    "semanaCiclo": 3,
    "temaPrincipal": "Defesa da Omoplata — Virada por Cima (Step Over), Defesa da Omoplata — Cambalhota, Omoplata",
    "observacoes": "informar",
    "tecnicas": [
      "Defesa da Omoplata — Virada por Cima (Step Over)",
      "Defesa da Omoplata — Cambalhota",
      "Omoplata"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a63bdd0e94658eae773a08f",
    "data": "2026-07-25",
    "semanaCiclo": 4,
    "temaPrincipal": "Bahiana (Double Leg Takedown), Chave de Pé Reta (Botinha / Straight Ankle Lock), Defesa da Kimura",
    "observacoes": "informar",
    "tecnicas": [
      "Bahiana (Double Leg Takedown)",
      "Chave de Pé Reta (Botinha / Straight Ankle Lock)",
      "Defesa da Kimura",
      "Kimura"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a5fd0bb4d477dfc685c75e8",
    "data": "2026-07-18",
    "semanaCiclo": 1,
    "temaPrincipal": "Algumas técnicas sem kimono para defesa pessoal de iniciantes.",
    "observacoes": "Algumas técnicas sem kimono para defesa pessoal de iniciantes.",
    "tecnicas": [
      "Arrasto de Braço (Arm Drag)",
      "O-soto gari"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a52482f65a3bf9903e664b7",
    "data": "2026-07-11",
    "semanaCiclo": 2,
    "temaPrincipal": "Sumi Gaeshi, Estrangulamento Relógio (Clock Choke), Estrangulamento do 4 apoios pegando a perna e rolando por cima",
    "observacoes": "informar",
    "tecnicas": [
      "Sumi Gaeshi",
      "Estrangulamento Relógio (Clock Choke)",
      "Estrangulamento do 4 apoios pegando a perna e rolando por cima",
      "O-uchi gari"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a5245d20f86f2755105f82d",
    "data": "2026-07-04",
    "semanaCiclo": 3,
    "temaPrincipal": "Katagatame (Arm Triangle / Kata Gatame), Norte-Sul (North South Choke), Harai Goshi",
    "observacoes": "informar",
    "tecnicas": [
      "Katagatame (Arm Triangle / Kata Gatame)",
      "Norte-Sul (North South Choke)",
      "Harai Goshi",
      "Queda de Quadril (Hip Throw / Ogoshi)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a368df97efb4df061a07f6c",
    "data": "2026-06-20",
    "semanaCiclo": 4,
    "temaPrincipal": "Balança (Pendulum Sweep), Tesoura (Scissor Sweep), Sasae Tsurikomi Ashi (Gi e No Gi)",
    "observacoes": "informar",
    "tecnicas": [
      "Balança (Pendulum Sweep)",
      "Tesoura (Scissor Sweep)",
      "Sasae Tsurikomi Ashi (Gi e No Gi)",
      "Arco e Flecha (Bow and Arrow Choke)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6a1ae1c05d466f6908001470",
    "data": "2026-05-30",
    "semanaCiclo": 1,
    "temaPrincipal": "Estrangulamento rodado partindo do joelho na barriga e estrangulando., Defesa do Mata-Leão (RNC Escape), Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
    "observacoes": "informar",
    "tecnicas": [
      "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
      "Defesa do Mata-Leão (RNC Escape)",
      "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69ff30f9a64ed50d6bc6b3d6",
    "data": "2026-05-09",
    "semanaCiclo": 2,
    "temaPrincipal": "Arco e Flecha (Bow and Arrow Choke), Estrangulamento das costas cruzando o braço e segurando uma lapela",
    "observacoes": "informar",
    "tecnicas": [
      "Arco e Flecha (Bow and Arrow Choke)",
      "Estrangulamento das costas cruzando o braço e segurando uma lapela"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69e37b8fe0a1feaa42b5887f",
    "data": "2026-04-18",
    "semanaCiclo": 3,
    "temaPrincipal": "Faltou o paper cut choke",
    "observacoes": "Faltou o paper cut choke",
    "tecnicas": [
      "Passagem de Guarda em Pé Manga Cruzada",
      "Passagem de Guarda em Pé Manga Paralela",
      "Desequilíbrio de Cabeça (Snap Down)",
      "Arrasto de Braço (Arm Drag)",
      "Paper Cutter Choke"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69d0fd89d7fa9b7c50a9817b",
    "data": "2026-04-04",
    "semanaCiclo": 4,
    "temaPrincipal": "Triângulo (Triangle Choke), Paper Cutter Choke, Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
    "observacoes": "informar",
    "tecnicas": [
      "Triângulo (Triangle Choke)",
      "Paper Cutter Choke",
      "Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)",
      "Defesa da Montada — Ponte e Rolo (Upa Escape)",
      "Tai Otoshi"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69c84cbeb90eda63b64889ec",
    "data": "2026-03-28",
    "semanaCiclo": 1,
    "temaPrincipal": "'+finalização do baldinho",
    "observacoes": "'+finalização do baldinho",
    "tecnicas": [
      "Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
      "Queda por Fora da Perna (Osoto Gari)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69be8b799a25f36209d993a1",
    "data": "2026-03-21",
    "semanaCiclo": 2,
    "temaPrincipal": "Para no gi, o estrangulamento rodado é o baseball choke.",
    "observacoes": "Para no gi, o estrangulamento rodado é o baseball choke.",
    "tecnicas": [
      "Estrangulamento rodado partindo do joelho na barriga e estrangulando.",
      "Uchi Mata",
      "Queda por Dentro da Perna (Ouchi Gari)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "69b599f2c55be8fc2106cdd2",
    "data": "2026-03-14",
    "semanaCiclo": 3,
    "temaPrincipal": "Queda de Quadril (Hip Throw / Ogoshi), Passagem com Pressão no Ombro (Shoulder Pressure Pass)",
    "observacoes": "informar",
    "tecnicas": [
      "Queda de Quadril (Hip Throw / Ogoshi)",
      "Passagem com Pressão no Ombro (Shoulder Pressure Pass)"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "6922a6ca61374baf38ee5199",
    "data": "2025-11-22",
    "semanaCiclo": 4,
    "temaPrincipal": "Osoto gari, morote seoi nage e ouchi gari. Raspagem do pêndulo partindo da guarda fechada. Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga e estrangulando.",
    "observacoes": "Osoto gari, morote seoi nage e ouchi gari. Raspagem do pêndulo partindo da guarda fechada. Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga e estrangulando.",
    "tecnicas": [
      "Fundamentos de BJJ",
      "Drills"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  },
  {
    "id": "68fd0a17824be991007940f4",
    "data": "2025-10-25",
    "semanaCiclo": 1,
    "temaPrincipal": "Kimura do 4 apoios abraçado por cima saindo pela lateral \nDefesa do triângulo com joelho no cóccix",
    "observacoes": "Kimura do 4 apoios abraçado por cima saindo pela lateral \nDefesa do triângulo com joelho no cóccix",
    "tecnicas": [
      "Fundamentos de BJJ",
      "Drills"
    ],
    "concluida": true,
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "turmaId": "turma-sabado",
    "turmaNome": "Jiu-Jitsu de Sábado (Técnica & Rola)"
  }
];

export const BASE44_ATTENDANCE: AttendanceRecord[] = [
  {
    "id": "6ac17b6286d7987a588a08db",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6ac17b621ceb0edbf5562f5b",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6ac17b615198944ca11be171",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6ac17b615991f6e45fd500f4",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6ac17b61044c947463d5656a",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6ac17b6003446a26a72facd2",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-10-03",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a899e901517d87dc117cd99",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a899e90665330f996016043",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a899e9064bf19d2692888bc",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a899e8f384606bf4282d942",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a899e8fdab2b972e1f5e7e3",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a899e8f3807a1a4a40e006c",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-15",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a77a47a2a53957a85210756",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a77a47ab92f2ebf6c4fd203",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a77a47a5196a40093f9afb9",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a77a4792f5c4d54b8bc3ee0",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a77a479bceee6b6ca801ed7",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a77a479cbc0c8e23116ad72",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4e3dba1f5b2af568cc",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4ea11367628e70a878",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4ec62f73c02f936d72",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4d64a946c9e5b7388b",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4d541d6aa3ce624258",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a71dd4dd20552dbd332c750",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-08-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a688f03a5efa6a81387e818",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a688f037f67dc2d16956307",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a688f02e412057d05f39ea1",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a688f0280de6e685622a9ee",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a688f02ff82ece400185eb1",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a688f027a7f622f7c151700",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a5fcf009d0620f8059594e2",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a5fcf0055917c1ca5de278d",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a5fceff924cfec9cc20e08c",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a5fceff1a71e1e878a34e15",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a5fceff55e63ad35ca8907a",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a52457724c59b64c14ecafb",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a524577e0b564cebf2973c1",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a524576c817bf82b6c64645",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a524576b65a1a334923fdba",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a52457661e6603419836550",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a52457604108a7c9321ac99",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-07-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a36b9892f16a2f7bfdb671b",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a36b9883ce8f92290db0711",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a36b9881dccd105e200c480",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a36b988a9885073593e0459",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a36b987c57e96fe847ae4ec",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a36b9872c6b2cf15a6a8662",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-20",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a3023f39b0fff537fabaf32",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a3023f34106493e5018d3c0",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a3023f22528cd8211853387",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a3023f22a846866a9b22044",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a3023f267a0778154a8b91d",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a3023f19dad236307380700",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-06",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a30237a04f51ee9534a66a6",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-13",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a30237a248a2d911669d05c",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-13",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6a30237a12ff42ef72a8571b",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-13",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": false,
    "observacao": "informar"
  },
  {
    "id": "6a30237932e3930d66ea324e",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-06-13",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69f87e02ba0b79dd13c91909",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-05-02",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69f87e028d84df0dce2372c1",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-05-02",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69f87dfec44c69ed717da6aa",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-05-02",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69e8e790ccae2a3b358294d5",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69e8e78f47a222c0ef204834",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69e8e78e6835260c5720b259",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69e8e78d6c171b9f5fe16178",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-18",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69d260d098ed228d11d8edc7",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69d260cff3db2d84ed158b60",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69d260cf548a4918b92816f4",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-04-04",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c84fc37e3ab2823277b6d8",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c84fc2988d40abf67b94a4",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c84fc12b3a750763f180cd",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c84fc02c3a8b7f8bedf079",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c1885e624e50d07b1b61c7",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-21",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c1885dce67a61306f9d562",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-21",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c1885b593b2837c0ece803",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-21",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c18859808ad5fbbc6a3476",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-21",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69c18859a7d59ae2e9fd50d3",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-21",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69b59fefcbc28e053efd0c13",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69b59fefeb3240cb7247e5d2",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69b59fee67faa33b041913aa",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69b59feec41d6bd29e029e43",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-03-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69a5d34f483d12dbee653a0f",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69a5d34e82e914c174f1b680",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69a5d34e159dc0a5887112a6",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-28",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "699232554342dcf6afa77555",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "699232558f67a824a92170cb",
    "studentId": "698780ef0663cdb43d0d7963",
    "studentNome": "Nathalie",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6992325459672d0872c9c219",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69923254e5eb703f7cbf0c45",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69923253a6d3172237503403",
    "studentId": "69923205bb1beebfa451eb72",
    "studentNome": "Heitor",
    "studentFaixa": "amarela",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-02-14",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "697ddb0b23da1c9b8f817442",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-01-24",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "697ddb0bf5a1830181450cee",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2026-01-24",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "692b13a3efb35a92d3bc0b78",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-29",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "692b13a2c759d517ae249101",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-29",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6922a5084a305c588cd6e704",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-22",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "6922a508f7da00e341b09d10",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-22",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "690f6cd19965b6e27682a721",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-08",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69060e77d312246ff2e79690",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69060e777d65a625e38cffb1",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "studentFaixa": "roxa",
    "studentGraus": 2,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "69060e76f9a9045c4cd90767",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-11-01",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "68fd0973fe7063ee17597b5e",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "studentFaixa": "branca",
    "studentGraus": 0,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-10-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "68fd09735194cbe3d1ddda48",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "studentFaixa": "verde",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-10-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  },
  {
    "id": "68fd09730aa1abd46bf24f16",
    "studentId": "68fd090b94a9ff66f66c7093",
    "studentNome": "Augusto",
    "studentFaixa": "azul",
    "studentGraus": 1,
    "turmaId": "turma-sabado",
    "turmaTitulo": "Jiu-Jitsu de Sábado (Técnica & Rola)",
    "data": "2025-10-25",
    "horario": "11:00 - 12:30",
    "confirmadoPor": "Thiago Lopes de Moraes Silva",
    "presente": true,
    "observacao": "informar"
  }
];

export const BASE44_PAYMENTS: PaymentRecord[] = [
  {
    "id": "pay-base44-6a30227dacccaf9cc51482cd",
    "studentId": "6a30227dacccaf9cc51482cd",
    "studentNome": "Enzo",
    "plano": "projeto_social",
    "mesReferencia": "Outubro/2026",
    "valor": 0.0,
    "valorOriginal": 180,
    "desconto": 180.0,
    "dataVencimento": "2026-10-10",
    "status": "isento",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-69c188b4ef911e5e175d922e",
    "studentId": "69c188b4ef911e5e175d922e",
    "studentNome": "Erick Dias Brito",
    "plano": "regular",
    "mesReferencia": "Outubro/2026",
    "valor": 180.0,
    "valorOriginal": 180,
    "desconto": 0,
    "dataVencimento": "2026-10-10",
    "status": "pendente",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-69c187d7eb47cb038a64d4d0",
    "studentId": "69c187d7eb47cb038a64d4d0",
    "studentNome": "Jonathan Ribeiro",
    "plano": "regular",
    "mesReferencia": "Outubro/2026",
    "valor": 180.0,
    "valorOriginal": 180,
    "desconto": 0,
    "dataVencimento": "2026-10-10",
    "status": "em_dia",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-69b59aa4d3902ead7c2612fd",
    "studentId": "69b59aa4d3902ead7c2612fd",
    "studentNome": "Luca",
    "plano": "projeto_social",
    "mesReferencia": "Outubro/2026",
    "valor": 0.0,
    "valorOriginal": 180,
    "desconto": 180.0,
    "dataVencimento": "2026-10-10",
    "status": "isento",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-69923205bb1beebfa451eb72",
    "studentId": "69923205bb1beebfa451eb72",
    "studentNome": "Heitor",
    "plano": "regular",
    "mesReferencia": "Outubro/2026",
    "valor": 180.0,
    "valorOriginal": 180,
    "desconto": 0,
    "dataVencimento": "2026-10-10",
    "status": "pendente",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-699231c36c90200fa83c8578",
    "studentId": "699231c36c90200fa83c8578",
    "studentNome": "Rafaela",
    "plano": "regular",
    "mesReferencia": "Outubro/2026",
    "valor": 180.0,
    "valorOriginal": 180,
    "desconto": 0,
    "dataVencimento": "2026-10-10",
    "status": "pendente",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-698780ef0663cdb43d0d7963",
    "studentId": "698780ef0663cdb43d0d7963",
    "studentNome": "Nathalie",
    "plano": "projeto_social",
    "mesReferencia": "Outubro/2026",
    "valor": 0.0,
    "valorOriginal": 180,
    "desconto": 180.0,
    "dataVencimento": "2026-10-10",
    "status": "isento",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-68fd0955de4e44d137a8a2c0",
    "studentId": "68fd0955de4e44d137a8a2c0",
    "studentNome": "Breno",
    "plano": "projeto_social",
    "mesReferencia": "Outubro/2026",
    "valor": 0.0,
    "valorOriginal": 180,
    "desconto": 180.0,
    "dataVencimento": "2026-10-10",
    "status": "isento",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-68fd093257d92252431ccc5b",
    "studentId": "68fd093257d92252431ccc5b",
    "studentNome": "Julia Lopes de Moraes",
    "plano": "projeto_social",
    "mesReferencia": "Outubro/2026",
    "valor": 0.0,
    "valorOriginal": 180,
    "desconto": 180.0,
    "dataVencimento": "2026-10-10",
    "status": "isento",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-68fd090b94a9ff66f66c7093",
    "studentId": "68fd090b94a9ff66f66c7093",
    "studentNome": "Augusto",
    "plano": "regular",
    "mesReferencia": "Outubro/2026",
    "valor": 180.0,
    "valorOriginal": 180,
    "desconto": 0,
    "dataVencimento": "2026-10-10",
    "status": "pendente",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  },
  {
    "id": "pay-base44-68f7dd1df8a8c1b4a9813794",
    "studentId": "68f7dd1df8a8c1b4a9813794",
    "studentNome": "Murilo Fernandes da Silva",
    "plano": "bolsista",
    "mesReferencia": "Outubro/2026",
    "valor": 108.0,
    "valorOriginal": 180,
    "desconto": 72.0,
    "dataVencimento": "2026-10-10",
    "status": "em_dia",
    "professorId": "inst-thiago",
    "professorNome": "Thiago Lopes de Moraes Silva",
    "chavePixProfessor": "thiagomoraes.mail@gmail.com"
  }
];

export const BASE44_MIGRATION_SQL: string = "-- =============================================================\n-- MIGRAÇÃO OFICIAL BASE44 > SUPABASE - TERNATIO BJJ\n-- =============================================================\n\n-- 1. ALUNOS (11 Alunos Reais do Base44)\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('6a30227dacccaf9cc51482cd', 'Enzo', 'enzo@informar.com', 'informar', 'informar', '2026-05-30', 'branca', 0, '2026-05-30', 3, 40, 3, 'projeto_social', 0.0, 10, 'isento', 'Responsável: Jeferson; Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 75, \"finalizacoesAplicadas\": 6, \"raspagensFeitas\": 9}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('69c188b4ef911e5e175d922e', 'Erick Dias Brito', 'jussaradiaspaz@gmail.com', '917972954', 'informar', '2026-03-23', 'branca', 0, '2026-03-23', 0, 40, 0, 'regular', 180.0, 10, 'pendente', 'Responsável: Jussara Dias; Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 0, \"finalizacoesAplicadas\": 0, \"raspagensFeitas\": 0}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'jonathan.rib.almeida@gmail.com', '11968659628', '1996-03-31', '2026-03-23', 'branca', 0, '2026-03-23', 9, 40, 9, 'regular', 180.0, 10, 'em_dia', 'informar', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 225, \"finalizacoesAplicadas\": 18, \"raspagensFeitas\": 27}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('69b59aa4d3902ead7c2612fd', 'Luca', 'luca@informar.com', 'informar', 'informar', '2026-03-14', 'branca', 0, '2026-03-14', 5, 40, 5, 'projeto_social', 0.0, 10, 'isento', 'Responsável: Jeferson; Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 125, \"finalizacoesAplicadas\": 10, \"raspagensFeitas\": 15}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('69923205bb1beebfa451eb72', 'Heitor', 'heitor@informar.com', 'informar', 'informar', '2026-02-15', 'amarela', 1, '2026-02-15', 1, 40, 1, 'regular', 180.0, 10, 'pendente', 'informar', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 25, \"finalizacoesAplicadas\": 2, \"raspagensFeitas\": 3}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('699231c36c90200fa83c8578', 'Rafaela', 'rafaela@informar.com', 'informar', 'informar', '2026-02-15', 'branca', 0, '2026-02-15', 5, 40, 5, 'regular', 180.0, 10, 'pendente', 'Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 125, \"finalizacoesAplicadas\": 10, \"raspagensFeitas\": 15}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('698780ef0663cdb43d0d7963', 'Nathalie', 'nathalie@informar.com', 'informar', 'informar', '2026-02-07', 'branca', 0, '2026-02-07', 1, 40, 1, 'projeto_social', 0.0, 10, 'isento', 'informar', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 25, \"finalizacoesAplicadas\": 2, \"raspagensFeitas\": 3}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('68fd0955de4e44d137a8a2c0', 'Breno', 'breno@informar.com', 'informar', 'informar', '2025-10-25', 'branca', 0, '2025-10-25', 16, 40, 16, 'projeto_social', 0.0, 10, 'isento', 'Responsável: Daniela; Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 400, \"finalizacoesAplicadas\": 32, \"raspagensFeitas\": 48}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'julia.lopes.de.moraes@informar.com', 'informar', 'informar', '2025-10-25', 'verde', 1, '2025-10-25', 17, 40, 17, 'projeto_social', 0.0, 10, 'isento', 'Responsável: Thiago Lopes de Moraes Silva; Menor de 16 anos', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 425, \"finalizacoesAplicadas\": 34, \"raspagensFeitas\": 51}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('68fd090b94a9ff66f66c7093', 'Augusto', 'augusto@informar.com', 'informar', 'informar', '2025-10-25', 'azul', 1, '2025-10-25', 1, 40, 1, 'regular', 180.0, 10, 'pendente', 'informar', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 25, \"finalizacoesAplicadas\": 2, \"raspagensFeitas\": 3}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\nINSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) VALUES ('68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'murilofernandes801@gmail.com', '11942492669', '2004-09-10', '2025-10-21', 'roxa', 2, '2026-06-05', 18, 40, 18, 'bolsista', 108.0, 10, 'em_dia', 'informar', 'informar', 75.0, 'Jiu-Jitsu de Sábado (Técnica & Rola)', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'graus_e_faixas', '{\"guarda\": 7.5, \"passagem\": 7.0, \"quedas\": 6.5, \"finalizacoes\": 7.0, \"defesa\": 7.5, \"disciplina\": 9.0, \"tempoRolaMinutos\": 450, \"finalizacoesAplicadas\": 36, \"raspagensFeitas\": 54}') ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, observacoes_medicas = EXCLUDED.observacoes_medicas;\n\n-- 2. TÉCNICAS (72 Técnicas Catalogadas)\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6aa55539c0ce1d425e86d3a2', 'Triângulo Brimbolando da Guarda Laçada', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'informar', '[\"informar\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a9c2426e3eab8647d488780', 'Guilhotina do 4 apoios', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Guilhotina puxando o oponente para cima mantendo dentro da guarda.', '[\"Guilhotina puxando o oponente para cima mantendo dentro da guarda\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a77334d95021c3c74a0d34d', 'Braço preso da Borboleta', 'Raspagem', 'branca', 'Iniciante', 'Ambos', 'informar', '[\"informar\"]', '[\"Raspagem\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a7730642ba3fc23f347cc12', 'Single Leg com Finalização no Leg Lock', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Entrada com ducking, laçando a perna do oponente com a perna de dentro.', '[\"Entrada com ducking, laçando a perna do oponente com a perna de dentro\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a63c37e12154d5dac842672', 'Defesa da Omoplata — Virada por Cima (Step Over)', 'Defesa Pessoal', 'azul', 'Intermediário', 'Ambos', 'Com a omoplata encaixada, gire o corpo acompanhando o movimento da finalização. Passe a perna por cima da cabeça do adversário e continue a rotação até liberar o ombro. Após escapar, estabilize a posição, buscando a passagem de guarda ou outra posição dominante.', '[\"Com a omoplata encaixada, gire o corpo acompanhando o movimento da finalização\", \"Passe a perna por cima da cabeça do adversário e continue a rotação até liberar o ombro\", \"Após escapar, estabilize a posição, buscando a passagem de guarda ou outra posição dominante\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a63c366c6f83d8bf4996d3c', 'Defesa da Omoplata — Cambalhota', 'Defesa Pessoal', 'azul', 'Intermediário', 'Ambos', 'Quando a omoplata estiver encaixada e não for mais possível recuperar a postura, faça uma cambalhota para frente acompanhando a direção da pressão. O rolamento alivia a torção no ombro e permite sair da finalização, frequentemente terminando por cima do adversário ou recuperando uma posição neutra.', '[\"Quando a omoplata estiver encaixada e não for mais possível recuperar a postura, faça uma cambalhota para frente acompanhando a direção da pressão\", \"O rolamento alivia a torção no ombro e permite sair da finalização, frequentemente terminando por cima do adversário ou recuperando uma posição neutra\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a63c34fdc4ad649d60469ff', 'Defesa da Omoplata — Postura', 'Defesa Pessoal', 'azul', 'Intermediário', 'Ambos', 'Assim que o adversário começar a atacar a omoplata, mantenha a postura ereta, cabeça levantada e peito aberto. Evite que seu ombro seja projetado para frente e mantenha o cotovelo próximo ao corpo. Antes que o adversário sente o quadril e controle sua postura, recupere a base e retire o braço da linha de ataque.', '[\"Assim que o adversário começar a atacar a omoplata, mantenha a postura ereta, cabeça levantada e peito aberto\", \"Evite que seu ombro seja projetado para frente e mantenha o cotovelo próximo ao corpo\", \"Antes que o adversário sente o quadril e controle sua postura, recupere a base e retire o braço da linha de ataque\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6a368c5b8b47fa4596d00d69', 'Sasae Tsurikomi Ashi (Gi e No Gi)', 'Queda', 'branca', 'Iniciante', 'No-Gi', 'Fazer pegada no braço e na gola, sair para o lado da gola aproximando do oponente e calçar o pé do oponente do lado do braço. Variação - Sair para o lado normalmente e depois inverter o lado com um salto e fazer o calço invertido. No Gi - A saida lateral é invertida. A pegada da gola deve ser por baixo da axila e depois sai para o lado do braço.', '[\"Fazer pegada no braço e na gola, sair para o lado da gola aproximando do oponente e calçar o pé do oponente do lado do braço\", \"Variação - Sair para o lado normalmente e depois inverter o lado com um salto e fazer o calço invertido\", \"No Gi - A saida lateral é invertida\", \"A pegada da gola deve ser por baixo da axila e depois sai para o lado do braço\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69ff3421a5c32ea4a5faabe8', 'Estrangulamento do 4 apoios pegando a perna e rolando por cima', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'informar', '[\"informar\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69ff3251252e971ba829d5a7', 'Estrangulamento do quatro apoios traingulo de mão invertido', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Na lateral do 4 apoios, entra com a mão do lado do oponente, por baixo da axila. Faz a pegada de cintbelt com o cotovelo na nuca. Entra o joelho pordentro e apoia a lateral da cabeça.', '[\"Na lateral do 4 apoios, entra com a mão do lado do oponente, por baixo da axila\", \"Faz a pegada de cintbelt com o cotovelo na nuca\", \"Entra o joelho pordentro e apoia a lateral da cabeça\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69f87eb2006feaff3496e30c', 'Uki Waza (Variação)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Inicia com pegada padrão. Soltar a mão da manga e fazer uma pegada  no braço cruzado por baixo da mão que está na gola. A mão da gola sobre e busca o pano nas costas.', '[\"Inicia com pegada padrão\", \"Soltar a mão da manga e fazer uma pegada  no braço cruzado por baixo da mão que está na gola\", \"A mão da gola sobre e busca o pano nas costas\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69e37fd2e34e79bd96f7ba9c', 'Passagem de Guarda em Pé Manga Cruzada', 'Passagem de Guarda', 'branca', 'Iniciante', 'Ambos', 'Uma mão no kimono na boca do estomago. A outra mão pega a manga do braço cruzado. Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura. Ao subir troca a mão da manga e a outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo.', '[\"Uma mão no kimono na boca do estomago\", \"A outra mão pega a manga do braço cruzado\", \"Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura\", \"Ao subir troca a mão da manga e a outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo\"]', '[\"Passagem de Guarda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69e37f85f77b375e077d0423', 'Passagem de Guarda em Pé Manga Paralela', 'Passagem de Guarda', 'branca', 'Iniciante', 'Ambos', 'Uma mão no kimono na boca do estomago. A outra mão pega a manga do braço paralelo. Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura. A outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo.', '[\"Uma mão no kimono na boca do estomago\", \"A outra mão pega a manga do braço paralelo\", \"Faz a base apoiando o pé do lado do braço morto e sobe rápido cuidando da postura\", \"A outra mão vai na cabeça do joelho do mesmo lado e começa a forçar para baixo\"]', '[\"Passagem de Guarda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a795544fe6344627f48', 'Drill de Rolamento para Trás', 'Drill', 'branca', 'Iniciante', 'Ambos', 'Sente no solo com as pernas dobradas. Role para trás dobrando o queixo ao peito e levando os joelhos ao rosto. Passe pelo ombro (não pela nuca) mantendo a cabeça inclinada para o lado. Ao sair, levante em base técnica.', '[\"Sente no solo com as pernas dobradas\", \"Role para trás dobrando o queixo ao peito e levando os joelhos ao rosto\", \"Passe pelo ombro (não pela nuca) mantendo a cabeça inclinada para o lado\", \"Ao sair, levante em base técnica\"]', '[\"Drill\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a78d4c47760680cedd7', 'Drill de Rolamento para Frente', 'Drill', 'branca', 'Iniciante', 'Ambos', 'Agache com os pés na largura dos ombros. Apoie uma mão no chão ligeiramente à frente. Baixe a cabeça para o lado, colocando o queixo no peito. Roleie pelo ombro em arco diagonal.', '[\"Agache com os pés na largura dos ombros\", \"Apoie uma mão no chão ligeiramente à frente\", \"Baixe a cabeça para o lado, colocando o queixo no peito\", \"Roleie pelo ombro em arco diagonal\"]', '[\"Drill\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a78ab79ebc0136eadef', 'Drill de Ponte (Bridge Drill)', 'Drill', 'branca', 'Iniciante', 'Ambos', 'Deite de costas com os joelhos dobrados e pés apoiados no chão próximos aos glúteos. Eleve o quadril o máximo possível de forma explosiva, contraindo glúteos e abrindo a coluna.', '[\"Deite de costas com os joelhos dobrados e pés apoiados no chão próximos aos glúteos\", \"Eleve o quadril o máximo possível de forma explosiva, contraindo glúteos e abrindo a coluna\"]', '[\"Drill\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a78b6f0499f113757f8', 'Drill de Saída de Quadril (Shrimp Drill)', 'Drill', 'branca', 'Iniciante', 'Ambos', 'Deite de costas com o corpo estendido. Empurre o chão com um pé, girando levemente o quadril e deslizando-o para trás.', '[\"Deite de costas com o corpo estendido\", \"Empurre o chão com um pé, girando levemente o quadril e deslizando-o para trás\"]', '[\"Drill\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a7734001b27794a6c09', 'Defesa da Chave de Pé Reta (Straight Ankle Lock Escape)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando em chave de pé reta, controle o joelho adversário com a mão do lado da perna atacada. Gire o pé na direção do dedão para aliviar a pressão do tendão.', '[\"Quando em chave de pé reta, controle o joelho adversário com a mão do lado da perna atacada\", \"Gire o pé na direção do dedão para aliviar a pressão do tendão\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a77c467e32e08e10cf2', 'Defesa da Guilhotina (Guillotine Escape — Lateral)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando preso na guilhotina, controle o quadril adversário com a mão do mesmo lado do braço estrangulante. Leve a cabeça para o lado oposto ao braço estrangulante.', '[\"Quando preso na guilhotina, controle o quadril adversário com a mão do mesmo lado do braço estrangulante\", \"Leve a cabeça para o lado oposto ao braço estrangulante\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a772839e8c5925004bc', 'Defesa da Chave de Braço (Armbar Escape — Stack)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando preso no armbar, una as mãos (figura quatro) antes da extensão total. Empilhe o adversário aproximando os joelhos do adversário ao peito (stack).', '[\"Quando preso no armbar, una as mãos (figura quatro) antes da extensão total\", \"Empilhe o adversário aproximando os joelhos do adversário ao peito (stack)\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a77845ca6fcaa6ca11f', 'Defesa da Kimura', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando o adversário tenta aplicar kimura, segure sua própria calça ou entrelace as mãos bloqueando a rotação. Gire o corpo para dentro do adversário.', '[\"Quando o adversário tenta aplicar kimura, segure sua própria calça ou entrelace as mãos bloqueando a rotação\", \"Gire o corpo para dentro do adversário\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a76f0ef94d08c95266a', 'Defesa da Americana', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando o adversário começa a aplicar americana, una as mãos impedindo que o braço forme o ângulo de 90°. Estenda o braço para baixo colado ao corpo.', '[\"Quando o adversário começa a aplicar americana, una as mãos impedindo que o braço forme o ângulo de 90°\", \"Estenda o braço para baixo colado ao corpo\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a76d60d5f72553750f3', 'Defesa do Triângulo (Triangle Escape — Postura)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando capturado no triângulo, endireite a coluna imediatamente levantando a cabeça. Segure a calça adversária com a mão livre para estabilizar.', '[\"Quando capturado no triângulo, endireite a coluna imediatamente levantando a cabeça\", \"Segure a calça adversária com a mão livre para estabilizar\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a7618ae881392ec4b43', 'Defesa do Mata-Leão (RNC Escape)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Quando o braço adversário tenta se encaixar no pescoço, coloque imediatamente as duas mãos no braço atacante, baixe o queixo para dificultar o encaixe. Gire o corpo na direção do braço atacante.', '[\"Quando o braço adversário tenta se encaixar no pescoço, coloque imediatamente as duas mãos no braço atacante, baixe o queixo para dificultar o encaixe\", \"Gire o corpo na direção do braço atacante\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a75c1e0142563208c31', 'Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Proteja o pescoço e feche os cotovelos para dentro. Faça movimentos de quadril curtos e explosivos (bump) para criar espaço.', '[\"Proteja o pescoço e feche os cotovelos para dentro\", \"Faça movimentos de quadril curtos e explosivos (bump) para criar espaço\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a75d6cd472632a68061', 'Defesa da Montada — Ponte e Rolo (Upa Escape)', 'Defesa Pessoal', 'branca', 'Iniciante', 'Ambos', 'Da posição montada, proteja o pescoço fechando os cotovelos. Prenda o braço do oponente do mesmo lado que vai rolar. Plante o pé no chão e execute ponte explosiva.', '[\"Da posição montada, proteja o pescoço fechando os cotovelos\", \"Prenda o braço do oponente do mesmo lado que vai rolar\", \"Plante o pé no chão e execute ponte explosiva\"]', '[\"Defesa Pessoal\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a7354b7a428c9475e9e', 'Arm Triangle', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Posicione-se perpendicularmente ao adversário com o braço adversário preso entre sua cabeça e ombro. Feche o triângulo passando o braço por baixo do pescoço adversário e unindo as mãos.', '[\"Posicione-se perpendicularmente ao adversário com o braço adversário preso entre sua cabeça e ombro\", \"Feche o triângulo passando o braço por baixo do pescoço adversário e unindo as mãos\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a73242d250ba78b25f4', 'Katagatame (Arm Triangle / Kata Gatame)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da montada ou cruzada, prenda o braço adversário contra o pescoço dele mesmo. Apoie o ombro no rosto adversário. Una as mãos.', '[\"Da montada ou cruzada, prenda o braço adversário contra o pescoço dele mesmo\", \"Apoie o ombro no rosto adversário\", \"Una as mãos\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a728bc654bb1b97ccea', 'Estrangulamento Relógio (Clock Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da posição de turtle, insira a mão na gola adversária e passe o braço ao redor da cabeça. Circule o próprio corpo ao redor da cabeça adversária como um ponteiro de relógio.', '[\"Da posição de turtle, insira a mão na gola adversária e passe o braço ao redor da cabeça\", \"Circule o próprio corpo ao redor da cabeça adversária como um ponteiro de relógio\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a701ed505462d64a588', 'Chave de Joelho (Kneebar)', 'Finalização', 'azul', 'Intermediário', 'Ambos', 'Posicione o joelho adversário contra o seu quadril ou tronco como ponto de fulcro. Controle o joelho com ambos os braços. Estenda o quadril em direção ao joelho.', '[\"Posicione o joelho adversário contra o seu quadril ou tronco como ponto de fulcro\", \"Controle o joelho com ambos os braços\", \"Estenda o quadril em direção ao joelho\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6f2680a2065e7495d2', 'Chave de Pé Reta (Botinha / Straight Ankle Lock)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Controle o tornozelo adversário entre suas axilas. Prenda a perna adversária entre seus braços e tronco. Estenda o quadril para trás enquanto levanta o tornozelo.', '[\"Controle o tornozelo adversário entre suas axilas\", \"Prenda a perna adversária entre seus braços e tronco\", \"Estenda o quadril para trás enquanto levanta o tornozelo\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6f5cf199a495c7179e', 'Omoplata', 'Finalização', 'azul', 'Intermediário', 'Ambos', 'Da guarda, controle um braço adversário com as duas pernas. Gire o quadril 90° isolando o ombro adversário entre suas coxas. Sente-se, abraçando a cintura adversária.', '[\"Da guarda, controle um braço adversário com as duas pernas\", \"Gire o quadril 90° isolando o ombro adversário entre suas coxas\", \"Sente-se, abraçando a cintura adversária\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6f9cb42d18dd695545', 'Norte-Sul (North South Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da posição norte-sul, insira o braço sob a cabeça adversária encostando o ombro no rosto. Deslize o ombro contra o pescoço enquanto aperta com os braços.', '[\"Da posição norte-sul, insira o braço sob a cabeça adversária encostando o ombro no rosto\", \"Deslize o ombro contra o pescoço enquanto aperta com os braços\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6e05d7c24f3cedb2d4', 'Paper Cutter Choke', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da posição lateral, segure a gola/lapela adversária com uma mão. Use o antebraço como uma faca deslizando contra a artéria carótida.', '[\"Da posição lateral, segure a gola/lapela adversária com uma mão\", \"Use o antebraço como uma faca deslizando contra a artéria carótida\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6dad35f160f5b44018', 'Ezequiel (Ezekiel Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da montada ou meia guarda, insira uma mão pela manga do seu próprio kimono. Posicione o antebraço através do pescoço adversário e puxe com a mão livre.', '[\"Da montada ou meia guarda, insira uma mão pela manga do seu próprio kimono\", \"Posicione o antebraço através do pescoço adversário e puxe com a mão livre\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6dcf180478d29dd66f', 'Arco e Flecha (Bow and Arrow Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Das costas adversárias, segure a lapela adversária com uma mão e a calça no joelho com a outra. Estenda o corpo tensionando a lapela e a perna como um arco.', '[\"Das costas adversárias, segure a lapela adversária com uma mão e a calça no joelho com a outra\", \"Estenda o corpo tensionando a lapela e a perna como um arco\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6dc9e784f79e836c5f', 'Estrangulamento Cruzado (Cross Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da montada ou guarda, insira uma mão na lapela adversária com o polegar por dentro e a segunda mão cruzando por baixo segurando a lapela do outro lado.', '[\"Da montada ou guarda, insira uma mão na lapela adversária com o polegar por dentro e a segunda mão cruzando por baixo segurando a lapela do outro lado\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6cce254da1e5d6b9aa', 'Mata-Leão (Rear Naked Choke / RNC)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Das costas do adversário com ganchos, passe o braço de ataque sob o queixo, bíceps no pescoço. Segure o bíceps oposto e feche a nuca.', '[\"Das costas do adversário com ganchos, passe o braço de ataque sob o queixo, bíceps no pescoço\", \"Segure o bíceps oposto e feche a nuca\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6c99da3b43c15be2a8', 'Guilhotina Baixa (Arm-In Guillotine)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Com controle da cabeça, antebraço sob o pescoço e mãos entrelaçadas em frente ao peito adversário, comprimindo a garganta.', '[\"Com controle da cabeça, antebraço sob o pescoço e mãos entrelaçadas em frente ao peito adversário, comprimindo a garganta\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6c04e48296d6cd18ec', 'Guilhotina Alta (High Elbow Guillotine)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Com a cabeça do adversário no clinch, antebraço sob o queixo com cotovelo elevado acima do ombro. Aperto explosivo.', '[\"Com a cabeça do adversário no clinch, antebraço sob o queixo com cotovelo elevado acima do ombro\", \"Aperto explosivo\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6b9457a7425ece369b', 'Triângulo (Triangle Choke)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Da guarda, controle um braço adversário puxando para dentro e passe a perna sobre o ombro. Feche o triângulo (pé atrás do joelho oposto).', '[\"Da guarda, controle um braço adversário puxando para dentro e passe a perna sobre o ombro\", \"Feche o triângulo (pé atrás do joelho oposto)\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6b82dc728216da3906', 'Kimura', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Controle o punho adversário com uma mão e passe o outro braço por cima travando em quatro. Gire em direção às costas com cotovelo elevado.', '[\"Controle o punho adversário com uma mão e passe o outro braço por cima travando em quatro\", \"Gire em direção às costas com cotovelo elevado\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6aa4935bc3dd03faca', 'Chave de Braço (Armbar / Juji Gatame)', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Isole o braço do adversário entre suas pernas com polegar para cima. Eleve o quadril empurrando o cotovelo enquanto puxa o punho.', '[\"Isole o braço do adversário entre suas pernas com polegar para cima\", \"Eleve o quadril empurrando o cotovelo enquanto puxa o punho\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a63498d825caa7ebbf2', 'Raspagem De La Riva (De La Riva Sweep)', 'Raspagem', 'branca', 'Iniciante', 'Ambos', 'Da guarda De La Riva, segure a manga e o tornozelo. Puxe a manga desequilibrando e empurre com o gancho até o adversário tombar.', '[\"Da guarda De La Riva, segure a manga e o tornozelo\", \"Puxe a manga desequilibrando e empurre com o gancho até o adversário tombar\"]', '[\"Raspagem\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a6165ce0fc7c074b16f', 'Gancho Borboleta (Butterfly Sweep)', 'Raspagem', 'branca', 'Iniciante', 'Ambos', 'Da guarda borboleta com ganchos internos, controle o tronco com underhook. Incline lateralmente elevando o gancho e suba montando.', '[\"Da guarda borboleta com ganchos internos, controle o tronco com underhook\", \"Incline lateralmente elevando o gancho e suba montando\"]', '[\"Raspagem\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a61d816e0a357cbc272', 'Balança (Pendulum Sweep)', 'Raspagem', 'branca', 'Iniciante', 'Ambos', 'Da guarda fechada, balance a perna livre em arco amplo ganhando momentum para tombar o adversário para o lado da manga puxada.', '[\"Da guarda fechada, balance a perna livre em arco amplo ganhando momentum para tombar o adversário para o lado da manga puxada\"]', '[\"Raspagem\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a610c92de42315d72b1', 'Tesoura (Scissor Sweep)', 'Raspagem', 'branca', 'Iniciante', 'Ambos', 'Da guarda fechada, canela no abdômen e perna de baixo no joelho adversário. Tesoure as pernas puxando a manga para derrubar.', '[\"Da guarda fechada, canela no abdômen e perna de baixo no joelho adversário\", \"Tesoure as pernas puxando a manga para derrubar\"]', '[\"Raspagem\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a5fb944dbf8b55a07df', 'Passagem com Pressão no Ombro (Shoulder Pressure Pass)', 'Passagem de Guarda', 'branca', 'Iniciante', 'Ambos', 'Pressione o ombro diretamente no rosto/queixo adversário enquanto avança os joelhos até a montada ou 100kg.', '[\"Pressione o ombro diretamente no rosto/queixo adversário enquanto avança os joelhos até a montada ou 100kg\"]', '[\"Passagem de Guarda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a58e0fc237734c51116', 'Joelho na Barriga (Knee Slice / Knee Cut)', 'Passagem de Guarda', 'branca', 'Iniciante', 'Ambos', 'Deslize o joelho de ataque sobre a coxa adversária cortando a guarda com pressão de tronco e termine no 100kg.', '[\"Deslize o joelho de ataque sobre a coxa adversária cortando a guarda com pressão de tronco e termine no 100kg\"]', '[\"Passagem de Guarda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a5850d152eb1ac33a3e', 'Projeção de Ombro (Seoi Nage)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Com pegada de gola e manga, gire 180° agachando o quadril sob o oponente e lance-o por sobre o ombro.', '[\"Com pegada de gola e manga, gire 180° agachando o quadril sob o oponente e lance-o por sobre o ombro\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a588db0497ce1a0c491', 'Queda por Fora da Perna (Osoto Gari)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'No clinch, varra a perna traseira do adversário com o jarrete empurrando o tronco para trás com vigor.', '[\"No clinch, varra a perna traseira do adversário com o jarrete empurrando o tronco para trás com vigor\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a57361ac92034289794', 'Queda por Dentro da Perna (Ouchi Gari)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Avance na base e varra a perna interna do oponente de dentro para fora puxando a gola para desequilibrar para trás.', '[\"Avance na base e varra a perna interna do oponente de dentro para fora puxando a gola para desequilibrar para trás\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a57b01da4292afca82b', 'Queda de Pé (Foot Sweep / Ashi Barai)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Varra o tornozelo adversário no momento exato da transferência de peso usando pegada de gola e manga.', '[\"Varra o tornozelo adversário no momento exato da transferência de peso usando pegada de gola e manga\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a57ef159aae32bc51fa', 'Fireman Carry', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Abaixe o nível e passe o braço do oponente sobre seus ombros como carregar nos ombros, projetando-o ao chão.', '[\"Abaixe o nível e passe o braço do oponente sobre seus ombros como carregar nos ombros, projetando-o ao chão\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a565af76bdcc9531baf', 'Sumi Gaeshi', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Queda sacrifício com gancho na coxa interna e pé no quadril, girando o oponente por cima em arco.', '[\"Queda sacrifício com gancho na coxa interna e pé no quadril, girando o oponente por cima em arco\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a563ce4fad215fdebd7', 'Tai Otoshi', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Bloqueio externo da perna dianteira do oponente com puxada forte de manga e tronco.', '[\"Bloqueio externo da perna dianteira do oponente com puxada forte de manga e tronco\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a56d60d5f72553750e0', 'Harai Goshi', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Varredura das coxas do adversário com quadril projetado e giro de ombros com pegada firme.', '[\"Varredura das coxas do adversário com quadril projetado e giro de ombros com pegada firme\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a551903592fe29e9bf5', 'Uchi Mata', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Pé entre as pernas e varredura da coxa interna adversária para o alto lançando o adversário no tatame.', '[\"Pé entre as pernas e varredura da coxa interna adversária para o alto lançando o adversário no tatame\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a556714f064d1565902', 'Desequilíbrio de Cabeça (Snap Down)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Puxe a cabeça do adversário explosivamente quebrando a postura para atacar pernas ou costas.', '[\"Puxe a cabeça do adversário explosivamente quebrando a postura para atacar pernas ou costas\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a545461f9dbf5d87a04', 'Queda de Quadril (Hip Throw / Ogoshi)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Avanço de quadril sob o oponente com abraço na cintura e projeção por cima das costas.', '[\"Avanço de quadril sob o oponente com abraço na cintura e projeção por cima das costas\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a52e5894f0c61a9a31a', 'Arrasto de Braço (Arm Drag)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Cruzamento do braço do adversário pelo peito com passo rápido nas costas para derrubada.', '[\"Cruzamento do braço do adversário pelo peito com passo rápido nas costas para derrubada\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a52242d250ba78b24bd', 'Single Leg', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Entrada de cabeça no peito/abdômen abraçando uma única perna e erguendo para queda.', '[\"Entrada de cabeça no peito/abdômen abraçando uma única perna e erguendo para queda\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('69a85a528947265dada8f880', 'Bahiana (Double Leg Takedown)', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Passo de penetração explosivo abraçando os dois joelhos e dirigindo o adversário ao solo.', '[\"Passo de penetração explosivo abraçando os dois joelhos e dirigindo o adversário ao solo\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('698782e720f0b0288d56a253', 'Crucifixo no gi', 'Finalização', 'branca', 'Iniciante', 'No-Gi', 'Controle de um braço com as pernas e outro com os braços sem kimono.', '[\"Controle de um braço com as pernas e outro com os braços sem kimono\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6987825920a5c0ecbe1ae77c', 'Crucifixo com rolamento por cima', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Trocar a perna que laça o braço, jogar o corpo por cima com auxílio da perna livre', '[\"Trocar a perna que laça o braço, jogar o corpo por cima com auxílio da perna livre\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6987817f2ccf62939c758576', 'Estrangulamento das costas cruzando o braço e segurando uma lapela', 'Finalização', 'branca', 'Iniciante', 'Gi', 'Importante, entrar bem a mão na gola e aproximar a cabeça da cabeça do oponente', '[\"Importante, entrar bem a mão na gola e aproximar a cabeça da cabeça do oponente\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('697ddbbbcf82d4feb3db5f3e', 'Passagem abraçando as pernas', 'Passagem de Guarda', 'branca', 'Iniciante', 'Ambos', 'Abraçar uma mão por baixo outra por cima e deslizar de ombro passando do lado abraçado por cima.', '[\"Abraçar uma mão por baixo outra por cima e deslizar de ombro passando do lado abraçado por cima\"]', '[\"Passagem de Guarda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6922a95c5b7776e29fc63663', 'O-soto gari', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Queda clássica de judô varrendo por fora da perna com empurrão de gola.', '[\"Queda clássica de judô varrendo por fora da perna com empurrão de gola\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6922a8f1ab1da2732578c0ff', 'Morote seoi nage', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Entrada de seoi nage com as duas mãos segurando a gola e manga, flexionando e projetando.', '[\"Entrada de seoi nage com as duas mãos segurando a gola e manga, flexionando e projetando\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6922a8cf3cb5cd44408ba8cf', 'O-uchi gari', 'Queda', 'branca', 'Iniciante', 'Ambos', 'Queda por dentro da perna com gancho na parte interna e desequilíbrio para trás.', '[\"Queda por dentro da perna com gancho na parte interna e desequilíbrio para trás\"]', '[\"Queda\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('6922a83b754dab7555e74ec4', 'Estrangulamento rodado partindo do joelho na barriga e estrangulando.', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga, pegada estilo baseball, rotacionando o corpo ajoelhando próximo a cabeça.', '[\"Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga, pegada estilo baseball, rotacionando o corpo ajoelhando próximo a cabeça\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\nINSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) VALUES ('68f7e1b7a27df674c6254824', 'Armlock da guarda com pé no quadril', 'Finalização', 'branca', 'Iniciante', 'Ambos', 'Armlock da guarda com pé no quadril e jogando a outra perna na axila. Detalhes: Saída de quadril, adução e mão no pescoço.', '[\"Armlock da guarda com pé no quadril e jogando a outra perna na axila\", \"Detalhes: Saída de quadril, adução e mão no pescoço\"]', '[\"Finalização\", \"Base44\", \"Currículo\"]') ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;\n\n-- 3. PLANOS DE AULA (21 Aulas Concluídas)\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6ac17c34d41b169bfe299656', '2026-10-03', 1, 'Projeção de Ombro (Seoi Nage), Queda de Pé (Foot Sweep / Ashi Barai), Balança (Pendulum Sweep)', 'informar', '[\"Projeção de Ombro (Seoi Nage)\", \"Queda de Pé (Foot Sweep / Ashi Barai)\", \"Balança (Pendulum Sweep)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6aa55418e294f8556609341d', '2026-09-12', 2, 'Defesa do Triângulo (Triangle Escape — Postura), Triângulo (Triangle Choke), Triângulo Brimbolando da Guarda Laçada', 'informar', '[\"Defesa do Triângulo (Triangle Escape — Postura)\", \"Triângulo (Triangle Choke)\", \"Triângulo Brimbolando da Guarda Laçada\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a9c248c1021c607faaada15', '2026-09-05', 3, 'Guilhotina Alta (High Elbow Guillotine), Guilhotina Baixa (Arm-In Guillotine), Guilhotina do 4 apoios', 'informar', '[\"Guilhotina Alta (High Elbow Guillotine)\", \"Guilhotina Baixa (Arm-In Guillotine)\", \"Guilhotina do 4 apoios\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a89a06b8907ab4db3327e19', '2026-08-22', 4, 'Raspagem segurando um braço e a queda quando o adversário solta', 'Raspagem segurando um braço e a queda quando o adversário solta', '[\"Raspagem De La Riva (De La Riva Sweep)\", \"Fireman Carry\", \"Estrangulamento Cruzado (Cross Choke)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a806c13e2683f0c99c09d17', '2026-08-15', 1, 'Chave de Braço (Armbar / Juji Gatame), Kimura, Tesoura (Scissor Sweep)', 'informar', '[\"Chave de Braço (Armbar / Juji Gatame)\", \"Kimura\", \"Tesoura (Scissor Sweep)\", \"Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)\", \"Armlock da guarda com pé no quadril\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a7732720b13251007bff9a9', '2026-08-08', 2, 'Braço preso da Borboleta, Single Leg com Finalização no Leg Lock, Joelho na Barriga (Knee Slice / Knee Cut)', 'informar', '[\"Braço preso da Borboleta\", \"Single Leg com Finalização no Leg Lock\", \"Joelho na Barriga (Knee Slice / Knee Cut)\", \"Gancho Borboleta (Butterfly Sweep)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a6debe6960465daa2fe350b', '2026-08-01', 3, 'Defesa da Omoplata — Virada por Cima (Step Over), Defesa da Omoplata — Cambalhota, Omoplata', 'informar', '[\"Defesa da Omoplata — Virada por Cima (Step Over)\", \"Defesa da Omoplata — Cambalhota\", \"Omoplata\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a63bdd0e94658eae773a08f', '2026-07-25', 4, 'Bahiana (Double Leg Takedown), Chave de Pé Reta (Botinha / Straight Ankle Lock), Defesa da Kimura', 'informar', '[\"Bahiana (Double Leg Takedown)\", \"Chave de Pé Reta (Botinha / Straight Ankle Lock)\", \"Defesa da Kimura\", \"Kimura\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a5fd0bb4d477dfc685c75e8', '2026-07-18', 1, 'Algumas técnicas sem kimono para defesa pessoal de iniciantes.', 'Algumas técnicas sem kimono para defesa pessoal de iniciantes.', '[\"Arrasto de Braço (Arm Drag)\", \"O-soto gari\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a52482f65a3bf9903e664b7', '2026-07-11', 2, 'Sumi Gaeshi, Estrangulamento Relógio (Clock Choke), Estrangulamento do 4 apoios pegando a perna e rolando por cima', 'informar', '[\"Sumi Gaeshi\", \"Estrangulamento Relógio (Clock Choke)\", \"Estrangulamento do 4 apoios pegando a perna e rolando por cima\", \"O-uchi gari\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a5245d20f86f2755105f82d', '2026-07-04', 3, 'Katagatame (Arm Triangle / Kata Gatame), Norte-Sul (North South Choke), Harai Goshi', 'informar', '[\"Katagatame (Arm Triangle / Kata Gatame)\", \"Norte-Sul (North South Choke)\", \"Harai Goshi\", \"Queda de Quadril (Hip Throw / Ogoshi)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a368df97efb4df061a07f6c', '2026-06-20', 4, 'Balança (Pendulum Sweep), Tesoura (Scissor Sweep), Sasae Tsurikomi Ashi (Gi e No Gi)', 'informar', '[\"Balança (Pendulum Sweep)\", \"Tesoura (Scissor Sweep)\", \"Sasae Tsurikomi Ashi (Gi e No Gi)\", \"Arco e Flecha (Bow and Arrow Choke)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6a1ae1c05d466f6908001470', '2026-05-30', 1, 'Estrangulamento rodado partindo do joelho na barriga e estrangulando., Defesa do Mata-Leão (RNC Escape), Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)', 'informar', '[\"Estrangulamento rodado partindo do joelho na barriga e estrangulando.\", \"Defesa do Mata-Leão (RNC Escape)\", \"Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69ff30f9a64ed50d6bc6b3d6', '2026-05-09', 2, 'Arco e Flecha (Bow and Arrow Choke), Estrangulamento das costas cruzando o braço e segurando uma lapela', 'informar', '[\"Arco e Flecha (Bow and Arrow Choke)\", \"Estrangulamento das costas cruzando o braço e segurando uma lapela\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69e37b8fe0a1feaa42b5887f', '2026-04-18', 3, 'Faltou o paper cut choke', 'Faltou o paper cut choke', '[\"Passagem de Guarda em Pé Manga Cruzada\", \"Passagem de Guarda em Pé Manga Paralela\", \"Desequilíbrio de Cabeça (Snap Down)\", \"Arrasto de Braço (Arm Drag)\", \"Paper Cutter Choke\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69d0fd89d7fa9b7c50a9817b', '2026-04-04', 4, 'Triângulo (Triangle Choke), Paper Cutter Choke, Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)', 'informar', '[\"Triângulo (Triangle Choke)\", \"Paper Cutter Choke\", \"Defesa da Montada — Cotovelo e Joelho (Elbow Knee Escape)\", \"Defesa da Montada — Ponte e Rolo (Upa Escape)\", \"Tai Otoshi\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69c84cbeb90eda63b64889ec', '2026-03-28', 1, '''+finalização do baldinho', '''+finalização do baldinho', '[\"Passagem com Pressão no Ombro (Shoulder Pressure Pass)\", \"Queda por Fora da Perna (Osoto Gari)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69be8b799a25f36209d993a1', '2026-03-21', 2, 'Para no gi, o estrangulamento rodado é o baseball choke.', 'Para no gi, o estrangulamento rodado é o baseball choke.', '[\"Estrangulamento rodado partindo do joelho na barriga e estrangulando.\", \"Uchi Mata\", \"Queda por Dentro da Perna (Ouchi Gari)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('69b599f2c55be8fc2106cdd2', '2026-03-14', 3, 'Queda de Quadril (Hip Throw / Ogoshi), Passagem com Pressão no Ombro (Shoulder Pressure Pass)', 'informar', '[\"Queda de Quadril (Hip Throw / Ogoshi)\", \"Passagem com Pressão no Ombro (Shoulder Pressure Pass)\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('6922a6ca61374baf38ee5199', '2025-11-22', 4, 'Osoto gari, morote seoi nage e ouchi gari. Raspagem do pêndulo partindo da guarda fechada. Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga e estrangulando.', 'Osoto gari, morote seoi nage e ouchi gari. Raspagem do pêndulo partindo da guarda fechada. Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga e estrangulando.', '[\"Fundamentos de BJJ\", \"Drills\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\nINSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, professor_id, professor_nome, turma_id, turma_nome) VALUES ('68fd0a17824be991007940f4', '2025-10-25', 1, 'Kimura do 4 apoios abraçado por cima saindo pela lateral \nDefesa do triângulo com joelho no cóccix', 'Kimura do 4 apoios abraçado por cima saindo pela lateral \nDefesa do triângulo com joelho no cóccix', '[\"Fundamentos de BJJ\", \"Drills\"]', true, 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)') ON CONFLICT (id) DO UPDATE SET tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;\n\n-- 4. PRESENÇAS (101 Registros de Chamada)\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b6286d7987a588a08db', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b621ceb0edbf5562f5b', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b615198944ca11be171', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b615991f6e45fd500f4', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b61044c947463d5656a', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6ac17b6003446a26a72facd2', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-10-03', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e901517d87dc117cd99', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e90665330f996016043', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e9064bf19d2692888bc', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e8f384606bf4282d942', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e8fdab2b972e1f5e7e3', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a899e8f3807a1a4a40e006c', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-15', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a47a2a53957a85210756', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a47ab92f2ebf6c4fd203', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a47a5196a40093f9afb9', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a4792f5c4d54b8bc3ee0', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a479bceee6b6ca801ed7', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a77a479cbc0c8e23116ad72', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4e3dba1f5b2af568cc', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4ea11367628e70a878', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4ec62f73c02f936d72', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4d64a946c9e5b7388b', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4d541d6aa3ce624258', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a71dd4dd20552dbd332c750', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-08-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f03a5efa6a81387e818', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f037f67dc2d16956307', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f02e412057d05f39ea1', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f0280de6e685622a9ee', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f02ff82ece400185eb1', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a688f027a7f622f7c151700', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a5fcf009d0620f8059594e2', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a5fcf0055917c1ca5de278d', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a5fceff924cfec9cc20e08c', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a5fceff1a71e1e878a34e15', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a5fceff55e63ad35ca8907a', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a52457724c59b64c14ecafb', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a524577e0b564cebf2973c1', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a524576c817bf82b6c64645', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a524576b65a1a334923fdba', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a52457661e6603419836550', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a52457604108a7c9321ac99', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-07-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b9892f16a2f7bfdb671b', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b9883ce8f92290db0711', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b9881dccd105e200c480', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b988a9885073593e0459', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b987c57e96fe847ae4ec', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a36b9872c6b2cf15a6a8662', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-20', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f39b0fff537fabaf32', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f34106493e5018d3c0', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f22528cd8211853387', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f22a846866a9b22044', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f267a0778154a8b91d', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a3023f19dad236307380700', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-06', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a30237a04f51ee9534a66a6', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-13', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a30237a248a2d911669d05c', '6a30227dacccaf9cc51482cd', 'Enzo', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-13', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a30237a12ff42ef72a8571b', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-13', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6a30237932e3930d66ea324e', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-06-13', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69f87e02ba0b79dd13c91909', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-05-02', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69f87e028d84df0dce2372c1', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-05-02', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69f87dfec44c69ed717da6aa', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-05-02', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69e8e790ccae2a3b358294d5', '699231c36c90200fa83c8578', 'Rafaela', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69e8e78f47a222c0ef204834', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69e8e78e6835260c5720b259', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69e8e78d6c171b9f5fe16178', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-18', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69d260d098ed228d11d8edc7', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69d260cff3db2d84ed158b60', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69d260cf548a4918b92816f4', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-04-04', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c84fc37e3ab2823277b6d8', '699231c36c90200fa83c8578', 'Rafaela', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c84fc2988d40abf67b94a4', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c84fc12b3a750763f180cd', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c84fc02c3a8b7f8bedf079', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c1885e624e50d07b1b61c7', '699231c36c90200fa83c8578', 'Rafaela', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-21', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c1885dce67a61306f9d562', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-21', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c1885b593b2837c0ece803', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-21', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c18859808ad5fbbc6a3476', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-21', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69c18859a7d59ae2e9fd50d3', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-21', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69b59fefcbc28e053efd0c13', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69b59fefeb3240cb7247e5d2', '69b59aa4d3902ead7c2612fd', 'Luca', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69b59fee67faa33b041913aa', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69b59feec41d6bd29e029e43', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-03-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69a5d34f483d12dbee653a0f', '699231c36c90200fa83c8578', 'Rafaela', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69a5d34e82e914c174f1b680', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69a5d34e159dc0a5887112a6', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-28', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('699232554342dcf6afa77555', '699231c36c90200fa83c8578', 'Rafaela', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('699232558f67a824a92170cb', '698780ef0663cdb43d0d7963', 'Nathalie', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6992325459672d0872c9c219', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69923254e5eb703f7cbf0c45', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69923253a6d3172237503403', '69923205bb1beebfa451eb72', 'Heitor', 'amarela', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-02-14', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('697ddb0b23da1c9b8f817442', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-01-24', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('697ddb0bf5a1830181450cee', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2026-01-24', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('692b13a3efb35a92d3bc0b78', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-29', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('692b13a2c759d517ae249101', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-29', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6922a5084a305c588cd6e704', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-22', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('6922a508f7da00e341b09d10', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-22', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('690f6cd19965b6e27682a721', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-08', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69060e77d312246ff2e79690', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69060e777d65a625e38cffb1', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'roxa', 2, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('69060e76f9a9045c4cd90767', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-11-01', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('68fd0973fe7063ee17597b5e', '68fd0955de4e44d137a8a2c0', 'Breno', 'branca', 0, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-10-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('68fd09735194cbe3d1ddda48', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'verde', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-10-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\nINSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES ('68fd09730aa1abd46bf24f16', '68fd090b94a9ff66f66c7093', 'Augusto', 'azul', 1, 'turma-sabado', 'Jiu-Jitsu de Sábado (Técnica & Rola)', '2025-10-25', '11:00 - 12:30', 'Thiago Lopes de Moraes Silva') ON CONFLICT (id) DO NOTHING;\n\n-- 5. PAGAMENTOS (Mensalidades dos Atletas)\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-6a30227dacccaf9cc51482cd', '6a30227dacccaf9cc51482cd', 'Enzo', 'projeto_social', 'Outubro/2026', 0.0, 180, 180.0, '2026-10-10', 'isento', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-69c188b4ef911e5e175d922e', '69c188b4ef911e5e175d922e', 'Erick Dias Brito', 'regular', 'Outubro/2026', 180.0, 180, 0, '2026-10-10', 'pendente', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-69c187d7eb47cb038a64d4d0', '69c187d7eb47cb038a64d4d0', 'Jonathan Ribeiro', 'regular', 'Outubro/2026', 180.0, 180, 0, '2026-10-10', 'em_dia', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-69b59aa4d3902ead7c2612fd', '69b59aa4d3902ead7c2612fd', 'Luca', 'projeto_social', 'Outubro/2026', 0.0, 180, 180.0, '2026-10-10', 'isento', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-69923205bb1beebfa451eb72', '69923205bb1beebfa451eb72', 'Heitor', 'regular', 'Outubro/2026', 180.0, 180, 0, '2026-10-10', 'pendente', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-699231c36c90200fa83c8578', '699231c36c90200fa83c8578', 'Rafaela', 'regular', 'Outubro/2026', 180.0, 180, 0, '2026-10-10', 'pendente', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-698780ef0663cdb43d0d7963', '698780ef0663cdb43d0d7963', 'Nathalie', 'projeto_social', 'Outubro/2026', 0.0, 180, 180.0, '2026-10-10', 'isento', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-68fd0955de4e44d137a8a2c0', '68fd0955de4e44d137a8a2c0', 'Breno', 'projeto_social', 'Outubro/2026', 0.0, 180, 180.0, '2026-10-10', 'isento', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-68fd093257d92252431ccc5b', '68fd093257d92252431ccc5b', 'Julia Lopes de Moraes', 'projeto_social', 'Outubro/2026', 0.0, 180, 180.0, '2026-10-10', 'isento', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-68fd090b94a9ff66f66c7093', '68fd090b94a9ff66f66c7093', 'Augusto', 'regular', 'Outubro/2026', 180.0, 180, 0, '2026-10-10', 'pendente', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;\nINSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) VALUES ('pay-base44-68f7dd1df8a8c1b4a9813794', '68f7dd1df8a8c1b4a9813794', 'Murilo Fernandes da Silva', 'bolsista', 'Outubro/2026', 108.0, 180, 72.0, '2026-10-10', 'em_dia', 'inst-thiago', 'Thiago Lopes de Moraes Silva', 'thiagomoraes.mail@gmail.com') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, valor = EXCLUDED.valor;";
