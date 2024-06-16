import request from "supertest";
import { ZgloszeniePayload } from "../../common/zgloszenieSchema";
import { FieldValidationError, ValidationErrorBody } from "../middleware/zodValidation";
import app from "../app";
import "../endpoints/zgloszenieEndpoints"
import { getMockBearerTokenWithRole, setupAuthenticationService } from "../testSetup";

setupAuthenticationService();
const mockToken = await getMockBearerTokenWithRole("admin");

describe("Dodawanie Zgloszenia - Testy", () => {

  it('powinno przetworzyć poprawne dane', async () => {
    const response = await request(app)
      .post('/Zgloszenie')
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
        Opis: 'Opis zlecenia', 
        Status: "przesłane" 
      }satisfies ZgloszeniePayload); 

    expect(response.status).toBe(200);
    expect(response.text).toBe('Zgłoszenie zostało pomyślnie dodane');
  });

  it('nie powinno przetworzyć danych z pustymi polami', async () => {
    const response = await request(app).post('/Zgloszenie').set({ authorization: "Bearer " + mockToken }).send({})
      const body = response.body as ValidationErrorBody;
      const errorFields = body.errors.map((e) => e.path);

      const requiredFields = ["Pracownik_IdPracownik", "Klient_IdKlient", "Opis"];

        requiredFields.forEach((field) => {
            const fieldError = body.errors.find((error) => error.path === field);
            expect(fieldError).toBeDefined();
        });

        expect(errorFields).toEqual(expect.arrayContaining(requiredFields));
  });

  it('nie powinno przetworzyć danych, gdy opis jest pusty', async () => {
    const response = await request(app)
    .post('/Zgloszenie')
    .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
        Opis: '', 
        Status: "przesłane" 
      });
      const body = response.body as ValidationErrorBody;
      
      expect(response.status).toBe(400);
      const descriptionError = body.errors.filter(
        (blad) => blad.path === "Opis" && blad.type === "too_small"
    );
      expect(descriptionError.length).toBeGreaterThan(0);
  });

  it('nie powinno przetworzyć danych, gdy status nie jest wartoscia z enum', async () => {
    const response = await request(app)
    .post('/Zgloszenie')
    .set({ authorization: "Bearer " + mockToken })
    .send({ 
      Pracownik_IdPracownik: 1, 
      Klient_IdKlient: "1", 
      Opis: 'Opis zlecenia', 
      Status: '' 
    });
    const body = response.body as ValidationErrorBody;

    expect(response.status).toBe(400);
      const statusError = body.errors.filter(
        (blad) => blad.path === "Status" && blad.type === "invalid_enum_value"
    );
      expect(statusError.length).toBeGreaterThan(0);
  });

  it('nie powinno przetworzyć danych, gdy pracowniktID jest mniejsze od 1', async () => {
    const response = await request(app)
    .post('/Zgloszenie')
    .set({ authorization: "Bearer " + mockToken })
    .send({ 
      Pracownik_IdPracownik: 0, 
      Klient_IdKlient: 1, 
      Opis: 'Opis zlecenia', 
      Status: "przesłane" 
    });
    const body = response.body as ValidationErrorBody;

    expect(response.status).toBe(400);
      const pracowniktIDError = body.errors.filter(
        (blad) => blad.path === "Pracownik_IdPracownik" && blad.type === "too_small"
    );
      expect(pracowniktIDError.length).toBeGreaterThan(0);
  });

  it('nie powinno przetworzyć danych, gdy Klient_IdKlient jest mniejsze od 1', async () => {
    const response = await request(app)
    .post('/Zgloszenie')
    .set({ authorization: "Bearer " + mockToken })
    .send({ 
      Pracownik_IdPracownik: 1, 
      Klient_IdKlient: 0, 
      Opis: 'Opis zlecenia', 
      Status: "przesłane" 
    });
    const body = response.body as ValidationErrorBody;

    expect(response.status).toBe(400);
      const Klient_IdKlientError = body.errors.filter(
        (blad) => blad.path === "Klient_IdKlient" && blad.type === "too_small"
    );
      expect(Klient_IdKlientError.length).toBeGreaterThan(0);
  });

});

describe('Pobieranie danych Zgloszenia - Testy', () => {
  it('powinno zwrócić dane zgloszenia dla istniejącego ID', async () => {
   
      const IdZgloszenie = 1;    
      const IdPracownik = 1; 
      const IdKlient = 1; 
      const Opis = 'Klient zglosil rysy na boku auta.'; 
      const Status = 'Przeslane'; 

      const response = await request(app)
          .get(`/Zgloszenie/${IdZgloszenie}`).set({ authorization: "Bearer " + mockToken });

      console.log(response.body)
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Pracownik_IdPracownik', IdPracownik);
      expect(response.body).toHaveProperty('Klient_IdKlient', IdKlient);
      expect(response.body).toHaveProperty('Opis', Opis);
      expect(response.body).toHaveProperty('Status', Status);
  });

  it('powinno zwrócić błąd 404 dla nieistniejącego ID zgloszenia', async () => {
      const nieistniejaceID = 0; 

      const response = await request(app)
          .get(`/Zgloszenie/${nieistniejaceID}`).set({ authorization: "Bearer " + mockToken });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Zgłoszenie nie zostało znalezione');
  });

  it('powinno zwrócić dane zgloszen', async () => {
   
    const IdPracownik = 1; 
    const IdKlient = 1; 
    const Opis = 'Klient zglosil rysy na boku auta.'; 
    const Status = 'Przeslane'; 

    const response = await request(app)
        .get(`/Zgloszenie`).set({ authorization: "Bearer " + mockToken });

    console.log(response.body)
    expect(response.body).toBeInstanceOf(Array);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('Pracownik_IdPracownik', IdPracownik);
    expect(response.body[0]).toHaveProperty('Klient_IdKlient', IdKlient);
    expect(response.body[0]).toHaveProperty('Opis', Opis);
    expect(response.body[0]).toHaveProperty('Status', Status);

    const IdPracownik_10 = 10; 
    const IdKlient_10 = 10; 
    const Opis_10 = 'Klient zglosil problemy z wycieraczkami w samochodzie.'; 
    const Status_10 = 'Przeslane'; 

    expect(response.status).toBe(200);
    expect(response.body[9]).toHaveProperty('Pracownik_IdPracownik', IdPracownik_10);
    expect(response.body[9]).toHaveProperty('Klient_IdKlient', IdKlient_10);
    expect(response.body[9]).toHaveProperty('Opis', Opis_10);
    expect(response.body[9]).toHaveProperty('Status', Status_10);
});

});

// describe('Usuwanie danych zgloszenia - Testy', () => {
//   it('powinno usunąć zgloszenie o podanym id', async () => {
//       const IdZgloszenie = 11;  
//       const response = await request(app).delete(`/Zgloszenie/${IdZgloszenie}`);

//       expect(response.statusCode).toBe(200);
//       expect(response.text).toBe("Zgloszenie zostało usunięte");
//   });

//   it('powinno zwrócić błąd 404 dla nieistniejącego ID zgloszenia', async () => {
//       const nieistniejaceID = 0; 
//       const response = await request(app).delete(`/Zgloszenie/${nieistniejaceID}`);

//       expect(response.status).toBe(404);
//       expect(response.text).toBe('Zgłoszenie nie zostało znalezione');
//   });
// });

describe('Modyfikowanie danych zgloszenia - Testy', () => {
  it('powinno przetworzyć poprawne dane', async () => {
    const IdZgloszenie = 3;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
        Opis: 'Opis zlecenia', 
        Status: "przesłane" 
      }satisfies Partial<ZgloszeniePayload>); 

    expect(response.status).toBe(200);
    expect(response.text).toBe("Zgłoszenie zostało zaktualizowane");
  });

  it('powinno przetworzyć poprawne dane', async () => {
    const IdZgloszenie = 3;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
        Opis: 'Opis zlecenia', 
      }satisfies Partial<ZgloszeniePayload>); 

    expect(response.status).toBe(200);
    expect(response.text).toBe("Zgłoszenie zostało zaktualizowane");
  });

  it('powinno przetworzyć poprawne dane', async () => {
    const IdZgloszenie = 3;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
      }satisfies Partial<ZgloszeniePayload>);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Zgłoszenie zostało zaktualizowane");
  });

  it('powinno przetworzyć poprawne dane', async () => {
    const IdZgloszenie = 3;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
      }satisfies Partial<ZgloszeniePayload>); 

    expect(response.status).toBe(200);
    expect(response.text).toBe("Zgłoszenie zostało zaktualizowane");
  });

  it('nie powinno ptrzetworzyć danych, gdy wszystkie pola są puste', async () => {
    const IdZgloszenie = 3;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({}satisfies Partial<ZgloszeniePayload>); 

    expect(response.status).toBe(400);
    expect(response.text).toBe("Brak danych do aktualizacji");
  });

  it('nie powinno przetworzyć danych, gdyzgloszenieID jest mniejsze od 1', async () => {
    const IdZgloszenie = 0;
    
    const response = await request(app)
      .patch(`/Zgloszenie/${IdZgloszenie}`)
      .set({ authorization: "Bearer " + mockToken })
      .send({ 
        Pracownik_IdPracownik: 1, 
        Klient_IdKlient: 1, 
        Opis: 'Opis zlecenia', 
        Status: "przesłane" 
      });  

    expect(response.status).toBe(404);
    expect(response.text).toBe("Zgłoszenie nie zostało znalezione");
  });
  
});
