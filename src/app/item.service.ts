import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Item } from './item';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  serverUrl = 'http://127.0.0.1:5000'
  constructor(private http: HttpClient) { }

  getItems() : Observable<any>{
    return this.http.get<Response>(this.serverUrl + '/item')
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<any>('getItems', []))
      );
  }

  getItemsByDepartmentId(departmentId: number) : Observable<any> {
    return this.http.get<Response>(this.serverUrl + '/department/' + departmentId + '/item')
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<any>('getItemsByDepartmentId', []))
    );
  }

  getDepartments() : Observable<any>{
    return this.http.get<Response>(this.serverUrl + '/department')
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<any>('getDepartments', []))
      );
  }

  addItem(item: Item) {
    let body = {};
    return this.http.post<Item>(this.serverUrl + '/item', item, httpOptions)
      .pipe(
        catchError(this.handleError<any>('addItem', item))
      )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
