export namespace dto {
	
	export class Bibliotecario {
	
	
	    static createFrom(source: any = {}) {
	        return new Bibliotecario(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class EstudianteComentarioDTO {
	
	
	    static createFrom(source: any = {}) {
	        return new EstudianteComentarioDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class EstudianteDTO {
	
	
	    static createFrom(source: any = {}) {
	        return new EstudianteDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class LibroDTO {
	
	
	    static createFrom(source: any = {}) {
	        return new LibroDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class PrestamoDTO {
	
	
	    static createFrom(source: any = {}) {
	        return new PrestamoDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

export namespace utils {
	
	export class ResponseStr {
	
	
	    static createFrom(source: any = {}) {
	        return new ResponseStr(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

