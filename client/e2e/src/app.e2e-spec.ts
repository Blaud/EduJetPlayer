import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // it('should input email', async () => {
  //   await page.navigateTo().then(async () => {
  //    await page.getEmail().sendKeys('iblaudi@gmail.ru').then(async () => {
  //     expect(await page.getEmail().getAttribute('value')).toEqual('iblaudi@gmail.ru');
  //    });
  //   });
  // });

  it('should input email', () => {
     page.navigateTo();
     page.getEmail().sendKeys('iblaudi@gmail.ru');
     expect(page.getEmail().getAttribute('value')).toEqual('iblaudi@gmail.ru');
  });

  it('should input password', () => {
    page.getPassword().sendKeys('123456');
    expect(page.getPassword().getAttribute('value')).toEqual('123456');
 });

it('should log in', async () => {
  page.getButton().click();
  expect(await page.getBtn().getText()).toEqual('assignment');
});


});
