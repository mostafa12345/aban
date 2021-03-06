<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations\Route;
use Symfony\Component\Yaml\Parser;
use Symfony\Component\Yaml\Dumper;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Service\Upload;
use AppBundle\Entity\User;

//use AppBundle\Entity\Activity;

/**
 * @Route("/CheckQuery")
 */
class CheckQueryController extends Controller {

    /**
     * @Route("/InsertData",name="insertSql")
     */
    public function InsertNewData(Request $request) {
        $ip = $this->container->get('request_stack')->getCurrentRequest()->getClientIp();

        if ($ip != "84.241.33.188" and $ip != "84.241.30.69") {
            return new Response(" ");
        }
        $file = $request->files->get("file");
        if (empty($file)) {
            return new Response("File Dont Send");
        }
        try {
            $upload = new Upload();
            $upload->SetFile($file);
            $nameupload = $upload->UploadFile();
        } catch (\Exception $e) {
            return new Response($e->getMessage());
        }
        if (empty($nameupload)) {
            return new Response("File Is Empty");
        }
        $result = $this->CheckInsertAppData($nameupload);

        return new Response(json_encode($result));
    }

    public function CheckInsertAppData($name) {
        $data = file_get_contents(__DIR__ . '/../Sql/LastUpload/' . $name);
        if (empty($data) || $data == " ") {
            return array();
        }
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        $AllEntity = json_decode($data);
        $response = array();
        $error = array();
        //read all entity of index
        foreach ($AllEntity as $Entitykey => $Entity) {
            $table = $Entitykey;
            if (is_array($AllEntity->{$Entitykey})) {
                //read all rows from entity
                foreach ($AllEntity->{$Entitykey} as $data) {
                    try {
                        if ($table == "fos_user") {
                            $userManager = $this->container->get('fos_user.user_manager');
                            $userAdmin = $userManager->createUser();
                            $userAdmin->setUsername($data->mobile);
                            $userAdmin->setEmail($data->email);
                            $userAdmin->setPlainPassword($data->mobile);
                            $userAdmin->setEnabled(true);
                            $em->persist($userAdmin);
                            $data->password = $userAdmin->getPassword();
                            $data->salt = $userAdmin->getSalt();
                            $data->enabled = 1;
                            $em->remove($userAdmin);
                        }
                        $sql = $this->insert($table, (array) $data);
                        $statement = $connection->prepare($sql);
                        $statement->execute();
                        $response[$table][] = $data->id;
                    } catch (\Exception $ex) {
                        $error[$table][]['id'] = $data->id;
                        $error[$table][]['message'] = $ex->getMessage();
                    }
                }
            }
        }

        //write log file if have error
        if (!empty($error)) {
            $file = "";
            if (file_exists(__DIR__ . '/../Sql/logs/errorinsert' . date("Y-m-d") . '.log')) {
                $file = file_get_contents(__DIR__ . '/../Sql/logs/errorinsert' . date("Y-m-d") . '.log');
            }
            if ($file != "") {
                $err = json_decode($file);
                $err = (array) $err;
                $err[] = $error;
                file_put_contents(__DIR__ . '/../Sql/logs/errorinsert' . date("Y-m-d") . '.log', json_encode($err));
            } else {
                $err[0] = $error;
                file_put_contents(__DIR__ . '/../Sql/logs/errorinsert' . date("Y-m-d") . '.log', json_encode($err));
            }
        }
        return $response;
    }

    /**
     * @Route("/UpdateData",name="updateSql")
     */
    public function UpdateNewData(Request $request) {
        $ip = $this->container->get('request_stack')->getCurrentRequest()->getClientIp();

        if ($ip != "84.241.33.188" and $ip != "84.241.30.69") {
            return new Response(" ");
        }
        $file = $request->files->get("file");
        if (empty($file)) {
            return new Response("File Dont Send");
        }
        try {
            $upload = new Upload();
            $upload->SetFile($file);
            $nameupload = $upload->UploadFile();
        } catch (\Exception $e) {
            return new Response($e->getMessage());
        }
        if (empty($nameupload)) {
            return new Response("File Is Empty");
        }
        $result = $this->CheckUpdateAppData($nameupload);

        return new Response(json_encode($result));
    }

    public function CheckUpdateAppData($name) {
        $data = file_get_contents(__DIR__ . '/../Sql/LastUpload/' . $name);
        if (empty($data) || $data == " ") {
            return array();
        }
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        $AllEntity = json_decode($data);
        $response = array();
        $error = array();

        //read all entity of index
        foreach ($AllEntity as $Entitykey => $Entity) {
            $table = $Entitykey;
            if (is_array($AllEntity->{$Entitykey})) {
                //read all rows from entity
                foreach ($AllEntity->{$Entitykey} as $data) {
                    try {
                        $sql = $this->update($table, (array) $data);
                        $statement = $connection->prepare($sql);
                        $statement->execute();
                        $response[$table][] = $data->id;
                    } catch (\Exception $ex) {
                        $error[$table][]['id'] = $data->id;
                        $error[$table][]['message'] = $ex->getMessage();
                    }
                }
            }
        }

        //write log file if have error
        if (!empty($error)) {
            $file = "";
            if (file_exists(__DIR__ . '/../Sql/logs/errorupdate' . date("Y-m-d") . '.log')) {
                $file = file_get_contents(__DIR__ . '/../Sql/logs/errorupdate' . date("Y-m-d") . '.log');
            }
            if ($file != "") {
                $err = json_decode($file);
                $err = (array) $err;
                $err[] = $error;
                file_put_contents(__DIR__ . '/../Sql/logs/errorupdate' . date("Y-m-d") . '.log', json_encode($err));
            } else {
                $err[0] = $error;
                file_put_contents(__DIR__ . '/../Sql/logs/errorupdate' . date("Y-m-d") . '.log', json_encode($err));
            }
        }
        return $response;
    }

    /**
     * @Route("/DeleteData",name="deleteSql")
     */
    public function DeleteData(Request $request) {
        $ip = $this->container->get('request_stack')->getCurrentRequest()->getClientIp();

        if ($ip != "84.241.33.188" and $ip != "84.241.30.69") {
            return new Response(" ");
        }
        $file = $request->files->get("file");
        if (empty($file)) {
            return new Response("File Dont Send");
        }
        try {
            $upload = new Upload();
            $upload->SetFile($file);
            $nameupload = $upload->UploadFile();
        } catch (\Exception $e) {
            return new Response($e->getMessage());
        }
        if (empty($nameupload)) {
            return new Response("File Is Empty");
        }
        $result = $this->CheckDeleteAppData($nameupload);

        return new Response(json_encode($result));
    }

    public function CheckDeleteAppData($name) {
        try {
            $data = file_get_contents(__DIR__ . '/../Sql/LastUpload/' . $name);
            if (empty($data) || $data == " ") {
                return array();
            }
            $em = $this->getDoctrine()->getManager();

            $connection = $em->getConnection();
            $AllEntity = json_decode($data);
            $response = array();
            $error = array();
            $i = 0;
            //read all entity of index
            foreach ($AllEntity as $Entitykey => $Entity) {
                $table = $Entitykey;
                //read all rows from entity
                if (is_array($AllEntity->{$Entitykey})) {
                    foreach ($AllEntity->{$Entitykey} as $id) {
                        try {
                            $sql = $this->removeById($table, $id);
                            $statement = $connection->prepare($sql);
                            $statement->execute();
                            $response[$table][] = $id;
                        } catch (\Exception $ex) {
                            $error[$table][]['id'] = $id;
                            $error[$table][]['message'] = $ex->getMessage();
                        }
                    }
                }
                $i++;
            }

            //write log file if have error
            if (!empty($error)) {
                $file = "";
                if (file_exists(__DIR__ . '/../Sql/logs/errordelete' . date("Y-m-d") . '.log')) {
                    $file = file_get_contents(__DIR__ . '/../Sql/logs/errordelete' . date("Y-m-d") . '.log');
                }
                if ($file != "") {
                    $err = json_decode($file);
                    $err = (array) $err;
                    $err[] = $error;
                    file_put_contents(__DIR__ . '/../Sql/logs/errordelete' . date("Y-m-d") . '.log', json_encode($err));
                } else {
                    $err[0] = $error;
                    file_put_contents(__DIR__ . '/../Sql/logs/errordelete' . date("Y-m-d") . '.log', json_encode($err));
                }
            }
            return $response;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * @Route("/TestSend")
     * @Template("AppBundle::test/test.html.twig")
     */
    public function TestSend() {
        return array(
        );
    }

    /**
     * @Route("/",name="CheckUpdateAndCreate")
     */
    public function index(Request $request) {
        $ip = $this->container->get('request_stack')->getCurrentRequest()->getClientIp();

        if ($ip != "84.241.33.188" and $ip != "84.241.30.69") {
            return new Response(" ");
        }
        try {
            // Read Data Create And Update
            $OutPutAll = array();
            $OutPutAll["create"] = $this->CheckCreate();
            $OutPutAll["update"] = $this->CheckUpdate();
            $OutPutAll["delete"] = $this->CheckDelete();

            if (!empty($OutPutAll))
                $OutPutAll = \json_encode($OutPutAll);

            file_put_contents(__DIR__ . "../../Sql/LastCheckQueryData.json", $OutPutAll);

            return new Response($OutPutAll);
        } catch (\Exception $e) {
            \file_put_contents(__DIR__ . "../../Sql/logs/OutputErrorAll" . date("Y-m-d") . ".log", $e->getMessage());
            return new Response("");
        }
    }

    public function CheckUpdate() {
        try {
            $AllData = array();
            //  read update animale
            //Read Data Update Fos_User
            $AllData["fos_user"] = $this->CheckUpdateAll("fos_user", array(
                "username", "email", "enabled", "salt", "password",
                "last_login", "locked", "expired", "expires_at",
                "password_requested_at", "name", "family", "phone",
                "mobile", "sex", "post_code", "money", "address",
                "photo", "created_at", "updated_at", "id"
            ));
            //Read Data Update AnimalsCategory
            $AllData["animalscategory"] = $this->CheckUpdateAll("animalscategory", array(
                "animalsType", "describtion", "created_at", "updated_at", "id"
            ));
            $AllData["activity_name"] = $this->CheckUpdateAll("activity_name", array(
                "id", "name", "created_at", "updated_at"
            ));

            $AllData["animals"] = $this->CheckUpdateAll("animals", array("name",
                "user_id", "active", "name", "age", "sex"
                , "weight", "stature", "microChip", "color",
                "codeParvande", "goneh", "nezhad",
                "dateCreateParvande", "Animalscategory_id",
                "created_at", "updated_at", "id"));
            //Read Data Update Activity
            $AllData["activity"] = $this->CheckUpdateAll("activity", array(
                "activity_name_id", "animale_id",
                "created_at", "updated_at", "desc"
                , "date", "send_sms", "id"
            ));

            $AllData["historyofanimalexamination"] = $this->CheckUpdateAll("historyofanimalexamination", array(
                "id", "dateHistory", "Describ", "created_at",
                "updated_at", "animals_id", "file"
            ));

            $AllData["animalsphoto"] = $this->CheckUpdateAll("animalsphoto", array(
                "id", "animals_id", "photo", "photoDefault",
                "created_at",
                "updated_at"
            ));
            //Write All Data In File Sql
            return $AllData;
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . "../../Sql/logs/OutputErrorUpdate" . date("Y-m-d") . ".log", $e->getMessage());
            return array("error" => 1);
        }
    }

    public function CheckUpdateAll($table, array $field) {
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        $stmt = $connection->prepare(sprintf("select * from update_sync where `n_table`='%s'", $table));
        $stmt->execute();
        $sync_table = $stmt->fetchAll();

        if (empty($sync_table)) {
            return array();
        }
        $sql = "select * from $table where ";
        $i = 0;

        // count all this array
        $count = count($sync_table);
        //find data in child array of type is array
        foreach ($sync_table as $key2 => $val) {
            // check this is last key or not
            if ($key2 + 1 == $count) {
                $sql .= sprintf(" id='%s' ", $val['id_updated']);
            } else {
                $sql .= sprintf(" id='%s' or ", $val['id_updated']);
            }
        }
        // Read All Data From DataBase
        $statement = $connection->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll();
        if (empty($result)) {
            return array();
        }
        $OutPut = array();
        $j = 0;
        // Read All Data And Save In OutPut
        foreach ($result as $value) {
            foreach ($field as $val) {
                $OutPut[$j][$val] = $value[$val];
            }
            $j++;
        }
        return $OutPut;
    }

    public function CheckCreate() {
        try {
            $OutPutAll = array();
            // All Function Create Query
            $OutPutAll["fos_user"] = $this->CheckCreateAll("fos_user", array(
                "id", "username", "email", "email_canonical","salt","password" ,"enabled", "locked",
                "username_canonical", "expires_at", "roles", "name", "family",
                "phone", "mobile", "sex", "post_code", "money", "address", "photo"
                , "created_at", "updated_at"
            ));
            $OutPutAll["activity_name"] = $this->CheckCreateAll("activity_name", array(
                "id", "name", "created_at", "updated_at"
            ));
            $OutPutAll["animalscategory"] = $this->CheckCreateAll("animalscategory", array(
                "id", "animalsType", "describtion", "created_at", "updated_at"
            ));

            $OutPutAll["activity"] = $this->CheckCreateAll("activity", array(
                "id", "activity_name_id", "animale_id", "created_at",
                "updated_at", "desc", "date", "send_sms"
            ));

            $OutPutAll["animals"] = $this->CheckCreateAll("animals", array(
                "id", "user_id", "active", "name", "age", "sex", "weight", "stature"
                , "microChip", "color", "codeParvande", "goneh", "nezhad",
                "dateCreateParvande", "Animalscategory_id", "created_at",
                "updated_at"
            ));
            $OutPutAll["historyofanimalexamination"] = $this->CheckCreateAll("historyofanimalexamination", array(
                "id", "dateHistory", "Describ", "created_at",
                "updated_at", "animals_id", "file"
            ));

            $OutPutAll["animalsphoto"] = $this->CheckCreateAll("animalsphoto", array(
                "id", "animals_id", "photo", "photoDefault",
                "created_at",
                "updated_at"
            ));
            return $OutPutAll;
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . "../../Sql/logs/OutputErrorCreate" . date("Y-m-d") . ".log", $e->getMessage());
            return array("error" => 1);
        }
    }

    public function CheckCreateAll($table, array $field) {
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        $stmt = $connection->prepare(sprintf("select * from insert_sync where `n_table`='%s'", $table));
        $stmt->execute();
        $sync_table = $stmt->fetchAll();

        if (empty($sync_table)) {
            return array();
        }
        $sql = "select * from $table where ";
        // count all this array
        $count = count($sync_table);
        //find data in child array of type is array
        foreach ($sync_table as $key2 => $val) {
            // check this is last key or not
            if ($key2 + 1 == $count) {
                $sql .= sprintf(" id='%s' ", $val['id_inserted']);
            } else {
                $sql .= sprintf(" id='%s' or ", $val['id_inserted']);
            }
        }

        // Read All Data From DataBase
        $statement = $connection->prepare(sprintf($sql));
        $statement->execute();
        $result = $statement->fetchAll();
        if (empty($result)) {
            return array();
        }
        $OutPut = array();
        $j = 0;
        // Read All Data And Save In OutPut
        foreach ($result as $value) {
            foreach ($field as $val) {
                $OutPut[$j][$val] = $value[$val];
            }
            $j++;
        }
        return $OutPut;
    }

    public function CheckDelete() {
        try {
            $em = $this->getDoctrine()->getManager();
            $connection = $em->getConnection();
            // Read All Data From DataBase
            $statement = $connection->prepare("select * from delete_sync");
            $statement->execute();
            $result = $statement->fetchAll();
            if (empty($result)) {
                return array();
            }
            $data = array();
            foreach ($result as $value) {
                switch ($value['n_table']) {
                    case "activity":
                        $data['activity'][] = $value['id_deleted'];
                        break;
                    case "activity_name":
                        $data['activity_name'][] = $value['id_deleted'];
                        break;
                    case "animals":
                        $data['animals'][] = $value['id_deleted'];
                        break;
                    case "animalsphoto":
                        $data['animalsphoto'][] = $value['id_deleted'];
                        break;
                    case "animalscategory":
                        $data['animalscategory'][] = $value['id_deleted'];
                        break;
                    case "historyofanimalexamination":
                        $data['historyofanimalexamination'][] = $value['id_deleted'];
                        break;
                    case "fos_user":
                        $data['fos_user'][] = $value['id_deleted'];
                        break;
                }
            }
            return $data;
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . "../../Sql/logs/OutputErrorDelete" . date("Y-m-d") . ".log", $e->getMessage());
            return array("error" => 1);
        }
    }

    /**
     * @Route("/Response",name="responseSql")
     */
    public function Response(Request $request) {
        $ip = $this->container->get('request_stack')->getCurrentRequest()->getClientIp();

        if ($ip != "84.241.33.188" and $ip != "84.241.30.69") {
            return new Response(" ");
        }
        $file = $request->files->get("file");
        if (empty($file)) {
            return new Response(0);
        }
        try {
            $upload = new Upload();
            $upload->SetFile($file);
            $nameupload = $upload->UploadFile();
        } catch (Exception $e) {
            return new Response(0);
        }
        if (empty($nameupload)) {
            return new Response(0);
        }
        $result = $this->emptySyncTable($nameupload);
        return new Response($result);
    }

    public function emptySyncTable($name) {
        $data = file_get_contents(__DIR__ . '/../Sql/LastUpload/' . $name);
        if (empty($data) || $data == " ") {
            return "";
        }
        $data = json_decode($data);
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        foreach ($data as $action => $entity) {
            $table = $action . "_sync";
            foreach ($entity as $n_table => $value) {
                foreach ($value as $id) {
                    try {
                        $sql = sprintf("delete from %s where id_%sd='%s' and n_table = '%s'", $table, $action, $id, $n_table);
                        if ($action == "insert")
                            $sql = sprintf("delete from %s where id_%sed='%s' and n_table = '%s'", $table, $action, $id, $n_table);
                        $statement = $connection->prepare($sql);
                        $statement->execute();
                    } catch (\Exception $e) {
                        var_dump($e->getMessage());
                    }
                }
            }
        }
        return "ok";
    }

    public function insert($table, array $data) {
        try {
            $sql_field = "insert into " . $table;
            $sql_data = "";
            $i = 1;
            $count_field = count($data);
            foreach ($data as $key => $value) {
                if ($i == 1) {
                    $sql_field .= "(`" . $key . "";
                    $sql_data .= " values ('" . $data[$key] . "'";
                } else {
                    if ($i == $count_field) {
                        $sql_field .= "`,`" . $key . "`)";
                        $sql_data .= ",'" . $data[$key] . "')";
                    } else {
                        $sql_field .= "`,`" . $key;
                        $sql_data .= ",'" . $data[$key] . "'";
                    }
                }
                $i++;
            }
            return $sql_field . $sql_data;
        } catch (\Exception $exc) {
            return "";
        }
    }

    public function update($table, array $data) {
        try {
            $sql = "update " . $table . " set ";
            $count_field = count($data);
            $i = 1;
            foreach ($data as $key => $value) {
                if ($key != "id") {
                    if ($i == $count_field) {
                        $sql .=sprintf(" `%s` ='%s' where id='%s'", $key, $value, $data['id']);
                    } else {
                        $sql .=sprintf(" `%s` ='%s' ,", $key, $value);
                    }
                }
                $i++;
            }

            return $sql;
        } catch (\Exception $exc) {
            return "";
        }
    }

    /**
     * Delete Data With array Id
     * @param array $id
     * @return boolean
     */
    public function removeById($table, $id) {
        try {
            $sql = sprintf("delete from `%s` where id = '%s'", $table, $id);
            return $sql;
        } catch (\Exception $exc) {
            return "";
        }
    }

}
