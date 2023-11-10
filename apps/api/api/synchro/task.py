import hashlib
import json
from datetime import datetime

import requests
from background_task import background
from os import environ

from api.affaire.models import Affaire

ENV = environ.get("ENV", "dev")


URL_SGM = "http://192.168.100.100/sgm/API/affaire.php"


@background(schedule=0)
def recuperer_donnees_sgm():
    """
    Récupere les données SGM affaires en background job
    """
    print("Récupération des données SGM")
    donnees = {"date": "01/01/2020"}

    if ENV == "PROD":
        response = requests.post(URL_SGM, data=donnees)

        # Ajout de la vérification d'erreur
        if response.status_code != 200:
            raise Exception(
                f"La requête a échoué avec le statut {response.status_code}"
            )

        response = response.json()

    else:
        response = {
            "0": {
                "NUMAFR": "300",
                "LOGIN": "NICOLAS",
                "Codesta": "INT",
                "datedeb": "04/07/2023",
                "DELAI_AFR": "",
                "raison": "SGM ",
                "codecli": "SGM",
                "descriptif": "PEUGEOT 208 5PL  GP008YB",
                "refdoc": "",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "0",
                "Libaff": "",
                "observation": "",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            },
            "1": {
                "NUMAFR": "43872",
                "LOGIN": "CD",
                "Codesta": "S00",
                "datedeb": "05/06/2040",
                "DELAI_AFR": "30/09/2001",
                "raison": "ARCELORMITTAL Mmee DEWAELE ",
                "codecli": "MAR54",
                "descriptif": "REE D'UN BOITARD BOTTELEUSE  ",
                "refdoc": "104961954",
                "codearticle": "AM02337051",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "1856.4",
                "Libaff": "",
                "observation": "43177 - 42656 - 42398 - 43614\r\nAchats reçu\r\nRoulements reçu\r\n",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "14/10/2020",
                "DEVIS": "",
                "correctif": "",
            },
            "2": {
                "NUMAFR": "44312",
                "LOGIN": "PHILIPPE",
                "Codesta": "S00",
                "datedeb": "04/04/2048",
                "DELAI_AFR": "27/05/2021",
                "raison": "SEABULK Mr BOIDIN ",
                "codecli": "SEA18",
                "descriptif": "INSPECTION DES 2 REDUCTEURS PORTIQUE P34",
                "refdoc": "ZSM2100029",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "4050",
                "Libaff": "",
                "observation": "",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "15/06/2021",
                "DEVIS": "1",
                "correctif": "",
            },
            "3": {
                "NUMAFR": "44519",
                "LOGIN": "OLIVIER",
                "Codesta": "SV0",
                "datedeb": "04/04/2251",
                "DELAI_AFR": "31/05/2021",
                "raison": "DILLINGER - BABINSKI FREDERIC",
                "codecli": "GTS61",
                "descriptif": "ENSEMBLE DE VÉROUILLAGE N°15",
                "refdoc": "45001522596",
                "codearticle": "2000001403",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "0",
                "Libaff": "",
                "observation": "43523 Modif Ecrou.\r\nSolde 637.13 à reporter sur 44518",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "26/05/2021",
                "DEVIS": "",
                "correctif": "",
            },
            "4": {
                "NUMAFR": "45204",
                "LOGIN": "PHILIPPE",
                "Codesta": "S00",
                "datedeb": "04/05/2040",
                "DELAI_AFR": "13/01/2001",
                "raison": "SMMF Mr LEMAIRE",
                "codecli": "SMMF01",
                "descriptif": "USINAGE DE 2 BAGUES BRONZE.",
                "refdoc": "A REGULARISER",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "2170",
                "Libaff": "",
                "observation": "",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "13/01/2022",
                "DEVIS": "",
                "correctif": "",
            },
            "5": {
                "NUMAFR": "45570",
                "LOGIN": "OLIVIER",
                "Codesta": "S00",
                "datedeb": "04/05/2057",
                "DELAI_AFR": "16/11/2022",
                "raison": "ARCELORMITTAL Mr LHEUREUX",
                "codecli": "MAR56",
                "descriptif": "REE PINCEUR SUP RAC",
                "refdoc": "OT 110398980 - 4002736678/20 ",
                "codearticle": "AM02065648",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "6435.1",
                "Libaff": "",
                "observation": "Modification chassis 3950 - ",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "24/11/2022",
                "DEVIS": "",
                "correctif": "",
            },
            "6": {
                "NUMAFR": "45706",
                "LOGIN": "FLAVIEN",
                "Codesta": "S00",
                "datedeb": "03/10/2023",
                "DELAI_AFR": "08/11/2001",
                "raison": "GTS - MR DIMITRI.BEKAERT",
                "codecli": "GTS63",
                "descriptif": "USINAGE EQUIPEMENTS ET SEMELLE MOTEUR + MONTAGE",
                "refdoc": "Mail du 03/10/2022 - 4500166658",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "2485",
                "Libaff": "",
                "observation": "",
                "obsdelai": "FINI A 12H00",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            },
            "7": {
                "NUMAFR": "45712",
                "LOGIN": "GALMA",
                "Codesta": "S00",
                "datedeb": "04/05/2034",
                "DELAI_AFR": "09/12/2022",
                "raison": "SOLLAC MARDYCK Mr TOUPIOL",
                "codecli": "MAR36",
                "descriptif": "CONFECTION DE 12 RACLEURS FOND + 12 RACLEURS BDC",
                "refdoc": "",
                "codearticle": "GALMA1",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "3437.84",
                "Libaff": "",
                "observation": "+  DP 45659 (G1 OCT 2022)",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "05/12/2022",
                "DEVIS": "",
                "correctif": "",
            },
            "8": {
                "NUMAFR": "45862",
                "LOGIN": "OLIVIER",
                "Codesta": "S00",
                "datedeb": "16/12/2024",
                "DELAI_AFR": "28/02/2023",
                "raison": "GTS INDUSTRIeeaaES",
                "codecli": "GTS",
                "descriptif": "REE RENVOI D'ANGLE",
                "refdoc": "4500168617 - 4500168725",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "986",
                "Libaff": "",
                "observation": "REE Renvoi D'angle 310\r\nRenvoi d'angle neuf 676",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "16/02/2023",
                "DEVIS": "",
                "correctif": "",
            },
            "9": {
                "NUMAFR": "46279",
                "LOGIN": "FLAVIEN",
                "Codesta": "D00",
                "datedeb": "04/07/2023",
                "DELAI_AFR": "",
                "raison": "FAPMO",
                "codecli": "FAPMO",
                "descriptif": "REPRISE USINAGE FUT INFERIEUR",
                "refdoc": "Mail du 03/07/2023",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "0",
                "Libaff": "",
                "observation": "",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            },
            "10": {
                "NUMAFR": "46280",
                "LOGIN": "GALMA",
                "Codesta": "EST",
                "datedeb": "04/07/2023",
                "DELAI_AFR": "",
                "raison": "SOLLAC MARDYCK Mr TOUPIOL",
                "codecli": "MAR36",
                "descriptif": "REVETEMENT FD10(45818) FD11(45818)",
                "refdoc": "",
                "codearticle": "GALMA1",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "17835.68",
                "Libaff": "",
                "observation": "Facturation Juillet",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            },
            "11": {
                "NUMAFR": "46281",
                "LOGIN": "FL",
                "Codesta": "E00",
                "datedeb": "04/07/2023",
                "DELAI_AFR": "07/07/2000",
                "raison": "GTS - MR VINCENT FOUQUE",
                "codecli": "GTS62",
                "descriptif": "REPRISE EPAISSEUR 2 CALES COMPENSATION Q1",
                "refdoc": "Demande du 04/07/2023",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "0",
                "Libaff": "",
                "observation": "45614",
                "obsdelai": "12H00 IMPERATIF",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            },
            "nombre_affaires": 12,
        }

    affaires_formatees = sgm_data_to_local(response)
    compare_affaires_sgm_local(affaires_formatees)


def sgm_data_to_local(data):
    """
    transforme les données sgm en dict pour le hasher et comparer avec bd actuelle
    exemple de donée recues:
    {
        "0": {
                "NUMAFR": "300",
                "LOGIN": "NICOLAS",
                "Codesta": "INT",
                "datedeb": "04/07/2023",
                "DELAI_AFR": "",
                "raison": "SGM ",
                "codecli": "SGM",
                "descriptif": "PEUGEOT 208 5PL  GP008YB",
                "refdoc": "",
                "codearticle": "",
                "COEF_H_MAJO": "25",
                "iassisth": "1",
                "montantcmd": "0",
                "Libaff": "",
                "observation": "",
                "obsdelai": "",
                "NOTE": "",
                "datefin": "",
                "DEVIS": "",
                "correctif": "",
            }
        }

        on recupere les champs et on les casts dans le bon format du model affaire:
        NUMAFR
        Codesta
        datedeb
        DELAI_AFR
        raison
        codecli
        descriptif
        refdoc
        codearticle
        observation
        DEVIS




    """

    # affaires récupérées
    affaires = []

    for affaire in data.keys():

        if affaire != "nombre_affaires":

            date_rendu = data[str(affaire)]["DELAI_AFR"]
            if date_rendu == "":
                date_rendu = None
            else:
                date_rendu = datetime.strptime(date_rendu, "%d/%m/%Y").strftime(
                    "%Y-%m-%d"
                )
            affaires.append(
                {
                    "num_affaire": data[str(affaire)]["NUMAFR"],
                    "statut": data[str(affaire)]["Codesta"],
                    "date_rendu": date_rendu,
                    "description": data[str(affaire)]["descriptif"],
                    "observation": data[str(affaire)]["observation"],
                    "ref_doc": data[str(affaire)]["refdoc"],
                    "client": data[str(affaire)]["raison"],
                    "charge_affaire": data[str(affaire)]["LOGIN"],
                }
            )

    return affaires


def compare_affaires_sgm_local(affaires_sgm):
    """
    Compare les affaires récupérées de la bd sgm avec celles en local.
    On se base pas sur l'id mais le numéro d'affaire.
    Si l'affaire existe déjà en local on la met à jour si le hash est différent.
    Si l'affaire n'existe pas on la crée.
    """

    compteur_affaires_modifiees = 0
    compteur_affaires_crees = 0

    for affaire_sgm in affaires_sgm:
        affaire = Affaire.objects.filter(num_affaire=affaire_sgm["num_affaire"])
        if affaire:
            affaire_first = affaire.first()
            hash_sgm_bd = dict_to_hash(affaire_sgm)
            if (
                affaire_first.hash_sgm_bd != hash_sgm_bd
                or affaire_first.hash_sgm_bd is None
            ):
                affaire.update(**affaire_sgm, hash_sgm_bd=hash_sgm_bd)
                compteur_affaires_modifiees += 1
        else:
            Affaire.objects.create(**affaire_sgm, hash_sgm_bd=dict_to_hash(affaire_sgm))
            compteur_affaires_crees += 1

    print(f"{compteur_affaires_modifiees} affaires modifiées")
    print(f"{compteur_affaires_crees} affaires créées")


def dict_to_hash(dictionary):
    """
    Hash un dictionnaire, utile pour comparer les affaires sgm et local
    """
    json_str = json.dumps(dictionary, sort_keys=True)
    hash_object = hashlib.sha256(json_str.encode())
    hash_value = hash_object.hexdigest()
    return hash_value
