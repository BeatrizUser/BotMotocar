import puppeteer from 'puppeteer';
  // ESSE MODELO PESQUISA E LISTA OBJETOS ENCONTRADOS
export async function getPlanos(int){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://www.consorcionacionalhonda.com.br/atendimento/planos-e-cotas/planos');
  
    // Wait for the respostas page to load and display the respostas.
    const respostasSelector = '.question-container .answer';
    const perguntasSelector = '.question-container .question';
    await page.waitForSelector(respostasSelector);
  
    // Extract the respostas from the page.
    const questions = await page.evaluate(perguntasSelector => {
      const anchors = Array.from(document.querySelectorAll(perguntasSelector));
      return anchors.map(anchor => {
        return `${anchor.textContent}`;
      });
    }, perguntasSelector);
    const respostas = await page.evaluate(respostasSelector => {
        const anchors = Array.from(document.querySelectorAll(respostasSelector));
        return anchors.map(anchor => {
          return `${anchor.textContent}`;
        });
      }, respostasSelector);

    const result = `*${questions[int]}* \n ${respostas[int]} \n\n`
    
    await browser.close();

    return result;
  
};
async function teste(index){
  var data = await getPlanos(index)
  console.log(data)
}
teste(1)