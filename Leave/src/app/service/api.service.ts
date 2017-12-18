import { Headers } from '@angular/http';

export class ApiService {
    getUrl(): string {
        return 'http://104.160.33.183:5000';
    }

    getHeaders(): Headers {
        return new Headers({ 'Content-Type': 'application/json' });
    }
}