<?php
class mysqlconn {
    //连接服务器、数据库以及执行SQL语句的类库
    public $servername;
    public $server_username;
    public $server_userpassword;
    public $database;
    public $conn;

    function __construct() {
        //构造函数初始化所要连接的数据库
        $this->servername = "localhost";
        $this->server_username = "root";
        $this->server_userpassword = "admin";
        $this->database = "ofpms";
        //连接服务器和数据库
        if($this->conn=mysqli_connect($this->servername, $this->server_username, $this->server_userpassword)) {
            if(!mysqli_select_db($this->conn, $this->database)) {
                echo "数据库连接错误！！！";
                exit;
            }
        } else {
            echo "无法连接到服务器！！！";
            exit;
        }
    }
    
	function excu($query) {
        //执行SQL语句
        if($result=mysqli_query($this->conn, $query)) {
            return $result;
        } else {
            echo "sql语句执行错误！！！请重试!!!";
            exit;
        }
    }

    function __destruct() {
        if($this->conn) {
            $this->conn->close();
        }
    }
}
?>