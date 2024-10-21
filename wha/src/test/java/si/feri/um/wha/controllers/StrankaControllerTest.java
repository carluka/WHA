package si.feri.um.wha.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import si.feri.um.wha.dao.StrankaRepository;
import si.feri.um.wha.models.Stranka;


import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;

@WebMvcTest(StrankaController.class)
@ActiveProfiles("dev")
public class StrankaControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StrankaRepository strankaDao;

    @Autowired
    private ObjectMapper objectMapper;

    private Stranka stranka;

    @BeforeEach
    void setUp(){
        stranka = new Stranka();
        stranka.setNaziv("Podjetje");
        stranka.setTelefon("123456789");
        stranka.setEmail("podjetje@podjetje.com");
    }

    @Test
    void testVrniStranka() throws Exception {
        List<Stranka> stranke = new ArrayList<>();
        stranke.add(stranka);

        when(strankaDao.findAll()).thenReturn(stranke);

        mockMvc.perform(get("/stranka"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].naziv").value("Podjetje"))
                .andExpect(jsonPath("$[0].telefon").value("123456789"));

        verify(strankaDao, times(1)).findAll();
    }
    @Test
    void testDodajStranko() throws Exception {
        when(strankaDao.save(any(Stranka.class))).thenReturn(stranka);

        mockMvc.perform(post("/stranka")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(stranka)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.naziv").value("Podjetje"))
                .andExpect(jsonPath("$.telefon").value("123456789"));

        verify(strankaDao, times(1)).save(any(Stranka.class));
    }


    @Test
    void testVrniDolocenoStranko() throws Exception {
        when(strankaDao.vrniDolocenoStranko(1L)).thenReturn(stranka);

        mockMvc.perform(get("/stranka/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.naziv").value("Podjetje"))
                .andExpect(jsonPath("$.telefon").value("123456789"));

        verify(strankaDao, times(1)).vrniDolocenoStranko(1L);
    }


    @Test
    void testIzbrisiStranko() throws Exception {
        doNothing().when(strankaDao).deleteById(1L);

        mockMvc.perform(delete("/stranka/izbrisi/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Uspesno izbrisana stranka."));

        verify(strankaDao, times(1)).deleteById(1L);
    }

    @Test
    void testPosodobistranka() throws Exception {
        Stranka updatedStranka = new Stranka();
        updatedStranka.setNaziv("Updated Stranka");

        when(strankaDao.vrniDolocenoStranko(1L)).thenReturn(stranka);
        when(strankaDao.save(any(Stranka.class))).thenReturn(updatedStranka);

        mockMvc.perform(put("/stranka/posodobi/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedStranka)))
                .andExpect(status().isOk())
                .andExpect(content().string("stranka uspešno posodobljen."));

        verify(strankaDao, times(1)).save(any(Stranka.class));
    }
}
