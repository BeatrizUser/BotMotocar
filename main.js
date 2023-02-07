import wppconnect from "@wppconnect-team/wppconnect";
import puppeteer from "puppeteer";

// ESSE MODELO PESQUISA E LISTA OBJETOS ENCONTRADOS
const planos = [];

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
    if (message.body.startsWith("#ConsórcioHonda")) {
      await client.sendText(message.from, `
    *Digite o número do Plano que você quer saber mais...*  

    *1* - Plano Easy  
    *2* - Plano Minha Scooter Honda  
    *3* - Plano Minha Scooter Honda +  
    *4* - Plano Vou de Honda  
    *5* - Plano Vou de Honda +  
    *6* - Plano Multichances  
    *7* - Plano Conquista  
    *8* - Plano Especial  
    *9* - Plano TRX e CRF 

    *0* - Para falar com um Consultor
    *10* - Para Localização
      `)
      // -22.77183900689023, -42.92587838440974
    } else if (message.body == "0") {
      client.sendContactVcard(message.from, '5521993577634@c.us', 'Suely Melo')
    } else if (message.body == "1") {
      const plano = await getinfo(0);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "2") {
      const plano = await getinfo(1);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "3") {
      const plano = await getinfo(2);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "4") {
      const plano = await getinfo(3);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "5") {
      const plano = await getinfo(4);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "6") {
      const plano = await getinfo(5);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "7") {
      const plano = await getinfo(6);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "8") {
      const plano = await getinfo(7);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "9") {
      const plano = await getinfo(8);
      client.sendText(message.from, `${plano}`);
    } else if (message.body == "10") {
      client.sendLocation(message.from, '-22.77183900689023', '-42.92587838440974', 'MotoCar Honda')
    }
  });
}
