import wppconnect from "@wppconnect-team/wppconnect";
import puppeteer from "puppeteer";
import * as menu from "./menus.js";

// ESSE MODELO PESQUISA E LISTA OBJETOS ENCONTRADOS
const planos = [];
var steps = 0;

async function getinfo(plano) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.consorcionacionalhonda.com.br/atendimento/planos-e-cotas/planos"
  );

  // Wait for the respostas page to load and display the respostas.
  const respostasSelector = ".question-container .answer";
  const perguntasSelector = ".question-container .question";
  await page.waitForSelector(respostasSelector);

  // Extract the respostas from the page.
  const questions = await page.evaluate((perguntasSelector) => {
    const anchors = Array.from(document.querySelectorAll(perguntasSelector));
    return anchors.map((anchor) => {
      return `${anchor.textContent}`;
    });
  }, perguntasSelector);
  const respostas = await page.evaluate((respostasSelector) => {
    const anchors = Array.from(document.querySelectorAll(respostasSelector));
    return anchors.map((anchor) => {
      return `${anchor.textContent}`;
    });
  }, respostasSelector);

  await browser.close();

  return `*${questions[plano]}* \n ${respostas[plano]}`;
  // return `teste`
}

wppconnect
  .create({
    session: "sessionName",
    statusFind: (statusSession, session) => {
      // return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      console.log("Status Session: ", statusSession);
      // create session wss return "serverClose" case server for close
      console.log("Session name: ", session);
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  client.onMessage(async (message) => {
    if (message.body.startsWith("#AtendimentoHonda") || message.body.startsWith('Voltar')) {
      await client.sendText(message.from, menu.MenuPrincipal())
      steps = 1
    } else if (message.body == "0") {
      client.sendContactVcard(message.from, '5521993577634@c.us', 'Suely Melo')
    } else if (message.body == "1" && steps == 1) {
      await client.sendText(message.from, menu.MenuMotos())
      steps = 2
    } else if (message.body == "2" && steps == 1) {
      await client.sendText(message.from, menu.MenuConsorcio())
      steps = 2
    } else if (message.body == "3" && steps == 1) {
      await client.sendText(message.from, menu.MenuFinanciamento())
      steps = 2
    } else if (message.body == "4" && steps == 1) {
      client.sendLocation(message.from, '-22.77183900689023', '-42.92587838440974', 'MotoCar Honda')
      steps = 2
    //PARTE MENU MOTOS OPCOES
    } else if (message.body == "1" && steps == 2) {
      client.sendText(message.from, menu.MenuMotos_1())
      steps = 31
    } else if (message.body == "2" && steps == 2) {
      client.sendText(message.from, menu.MenuMotos_2())
      steps = 32
    } else if (message.body == "3" && steps == 2) {
      client.sendText(message.from, menu.MenuMotos_3())
      steps = 33
    } else if (message.body == "4" && steps == 2) {
      client.sendText(message.from, menu.MenuMotos_4())
      steps = 34
      //PARTE MENU DE MOTOS POR NOMES
    } else if (message.body == "1" && steps == 31) {
      client.sendImage(
        message.from,
        './pop110i.png',
        'Pop 110i',
        `
        *Motor:* OHC, Monocilíndrico, 4 tempos,
        arrefecido a ar.
        *Cilindrada:* 109,1 cc
        *Transmissão:* 4 velocidades
        *Sistema de Partida:* Pedal
        *Freios:* A tambor / 110 mm
        *Cores:* Preto / Vermelho / Branco`
      )
      steps = 311
    } else if (message.body == "2" && steps == 31) {
      client.sendImage(
        message.from,
        './BIZ110i.png',
        'Biz 110i',
        `
        *Motor:* OHC, Monocilíndrico, 4 tempos,
        arrefecido a ar.
        *Cilindrada:* 109,1 cc
        *Transmissão:* 4 velocidades
        *Sistema de Partida:* Pedal
        *Freios:* A tambor / 130 mm
        *Cores:* Preto / Vermelho / Branco`
      )
      steps = 312
    } else if (message.body == "3" && steps == 31) {
      client.sendImage(
        message.from,
        './BIZ125.png',
        'Biz 125',
        `
        *Motor:* OHC, Monocilíndrico, 4 tempos,
        arrefecido a ar.
        *Cilindrada:* 124,9 cc
        *Transmissão:* 4 velocidades
        *Sistema de Partida:* Elétrico
        *Freios:* A tambor / 220 mm
        *Cores:* Prata Fosco / Vermelho / Branco Perolado / Azul e Branco`
      )
      steps = 313
    } else if (message.body == "4" && steps == 31) {
      client.sendImage(
        message.from,
        './ELITE-125.png',
        'Elite 125',
        `
        *Motor:* OHC, Monocilíndrico, 4 tempos,
        arrefecido a ar.
        *Cilindrada:* 124,9 cc
        *Transmissão:* Tipo V - MATIC
        *Sistema de Partida:* Elétrico
        *Freios:* A disco/ 190 mm
        *Cores:* Prata Metálico`
      )
      steps = 314
    } else if (message.body == "5" && steps == 31) {
      client.sendImage(
        message.from,
        './PCXSTDCBS.png',
        'PCX STD CBS',
        `
        *Motor:* OHC, Monocilíndrico, 4 tempos,
        arrefecido a líquido.
        *Cilindrada:* 149,3 cc
        *Transmissão:* Tipo V - MATIC
        *Sistema de Partida:* Elétrico
        *Freios:* A disco/ 220 mm
        *Cores:* Cinza Metálico`
      )
      steps = 315
    }
  });
}
