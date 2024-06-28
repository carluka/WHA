package si.feri.um.wha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class WhaApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhaApplication.class, args);
	}

}
